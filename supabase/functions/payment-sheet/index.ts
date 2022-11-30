import { serve } from "https://deno.land/std@0.165.0/http/server.ts"

import { _StripePublishableKey_, stripe } from "../_utils/config.ts"
import { getStripeCustomer } from "../_utils/supabase.ts"

console.log("payment-sheet handler up and running!")

serve(async (req) => {
  try {
    // Get the authorization header from the request.
    // When you invoke the function via the client library it will automatically pass the authenticated user's JWT.
    const jwt = req.headers.get("Authorization")!

    // Get the logged in user's Stripe customer ID
    const customer = await getStripeCustomer(jwt)

    // Create an ephermeralKey so that the Stripe SDK can fetch the customer's stored payment methods.
    const ephemeralKey = await stripe.ephemeralKeys.create(
      {
        customer: customer,
      },
      { apiVersion: "2020-08-27" }
    )

    // Create a PaymentIntent so that the SDK can charge the logged in customer.
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099,
      currency: "usd",
      customer: customer,
    })

    return new Response(
      JSON.stringify({
        stripe_pk: _StripePublishableKey_,
        paymentIntent: paymentIntent.client_secret,
        ephemeralKey: ephemeralKey.secret,
        customer: customer,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      }
    )
  } catch (error) {
    console.error("Payment sheet error ", error)
    return new Response(JSON.stringify(error), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})
