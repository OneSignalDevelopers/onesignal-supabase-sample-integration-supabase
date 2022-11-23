import { serve } from "https://deno.land/std@0.165.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@10.13.0?target=deno&deno-std=0.165.0"

import { _StripePublishableKey_, _StripeSecretKey_ } from "../_utils/config.ts"
import { createOrRetrieveCustomer } from "../_utils/supabase.ts"

const stripe = Stripe(_StripeSecretKey_, {
  httpClient: Stripe.createFetchHttpClient(),
})

console.log("payment-sheet handler up and running!")

serve(async (req) => {
  try {
    // Get the authorization header from the request.
    // When you invoke the function via the client library it will automatically pass the authenticated user's JWT.
    const jwt = req.headers.get("Authorization")!
    console.log(`User JWT:\n\t`, jwt)
    // Retrieve the logged in user's Stripe customer ID or create a new customer object for them.
    // See ../_utils/supabase.ts for the implementation.
    const customer = await createOrRetrieveCustomer(jwt)
    console.log(`Customer Id:\n\t`, customer)

    // Create an ephermeralKey so that the Stripe SDK can fetch the customer's stored payment methods.
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {
        customer: customer,
      },
      { apiVersion: "2020-08-27" }
    )
    console.log(`Stripe ephemeralKey:\n\t`, ephemeralKey)

    // Create a PaymentIntent so that the SDK can charge the logged in customer.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: "usd",
      customer: customer,
    })
    console.log(`Stripe paymentIntent:\n\t`, paymentIntent)

    // Return the customer details as well as teh Stripe publishable key which we have set in our secrets.
    const res = {
      stripe_pk: _StripePublishableKey_,
      paymentIntent: paymentIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer,
    }
    console.log(`Stripe response:\n\t`, res)

    return new Response(JSON.stringify({}), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    console.error("Payment sheet error ", error)
    return new Response(JSON.stringify(error), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})
