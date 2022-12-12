import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import jwt from "https://esm.sh/jsonwebtoken@8.5.1?deno-std=0.166.0"
import Stripe from "https://esm.sh/stripe@11.3.0"
import { _StripeWebhookSecret_ } from "../_utils/config.ts"
import { supabaseClient } from "../_utils/supabase.ts"

serve(async (req) => {
  try {
    const payloadJson = await req.json()
    console.log(payloadJson)
    const header = Stripe.webhooks.generateTestHeaderString({
      payload: payloadJson,
      secret: _StripeWebhookSecret_,
    })
    const event = Stripe.webhooks.constructEvent(
      payloadJson,
      header,
      _StripeWebhookSecret_
    )

    switch (event.type) {
      case "payment_intent.succeeded":
        console.log("Stripe Event\n\t", event)
        const { id, customer, amount, currency } = event.data.object as any
        const prismaResult = await supabaseClient.from("orders").insert({
          stripe_pi_id: id,
          stripe_customer_id: customer,
          amount: amount,
          currency: currency,
        })

        console.log({ prismaResult })

        return new Response(JSON.stringify({ message: "Ok" }), {
          headers: { "Content-Type": "application/json" },
        })
      default:
        return new Response("Server error.", {
          headers: { "Content-Type": "application/json" },
          status: 400,
        })
    }
  } catch (err) {
    console.error("Failed to create OneSignal notification", err)
    return new Response("Server error.", {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }
})
