import type { NextApiRequest, NextApiResponse } from "next"
import { loadStripe, Stripe } from "@stripe/stripe-js"
import { createClient } from "@supabase/supabase-js"

type Data = {
  message: string
}

let stripe: Stripe | null = null
const load = async () => {
  if (stripe) return stripe
  stripe = await loadStripe("pk_test_TYooMQauvdEDq54NiTphI7jx")
}

// Create a single supabase client for interacting with your database
const supabase = createClient(
  "https://xyzcompany.supabase.co",
  "public-anon-key"
)

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const sig = req.headers["stripe-signature"]
  const { data, type } = await req.body

  try {
    switch (type) {
      case "payment_intent.succeeded":
        const paymentIntent = data.object
        console.log(`paymentIntent\t\n${JSON.stringify(paymentIntent)}`)
        res.status(200).json(paymentIntent)
        break
      // ... handle other event types
      default:
        res.status(200).send({ message: `Unhandled event type ${type}` })
    }
  } catch (err) {
    res.status(400).end("Stripe webhook error.")
  }
}
