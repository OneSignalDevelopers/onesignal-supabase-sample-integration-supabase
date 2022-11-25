import { Stripe as _Stripe } from "stripe"

export const StripeWebhookSecret = process.env["STRIPE_WEBHOOK_SIGNING_SECRET"]!

export const SripeSecretKey = process.env["STRIPE_SECRET_KEY"]!

export const Stripe = new _Stripe(SripeSecretKey, {
  apiVersion: "2022-11-15",
})
