import type { NextApiRequest, NextApiResponse } from "next"

import { Supabase } from "../../lib/supabase"
import { Stripe, StripeWebhookSecret } from "../../lib/stripe"

type Data = {
  message: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  try {
    const payloadJson = JSON.stringify(req.body)
    const header = Stripe.webhooks.generateTestHeaderString({
      payload: payloadJson,
      secret: StripeWebhookSecret,
    })
    const event = Stripe.webhooks.constructEvent(
      payloadJson,
      header,
      StripeWebhookSecret
    )

    console.log("Stripe Event\n\t", event)

    switch (event.type) {
      case "payment_intent.succeeded":
        const { id, customer, amount, currency } = req.body.data.object
        const prismaResult = await Supabase.from("orders").insert({
          stripe_pi_id: id,
          stripe_customer_id: customer,
          amount: amount,
          currency: currency,
        })

        console.log({ prismaResult })

        res.status(200).send({ message: "Ok" })
        break
      default:
        res.status(400).send({ message: `Unhandled event type ${event.type}` })
    }
  } catch (err) {
    console.error(`Fatal error - ${err}`)
    res.status(500)
  }
}
