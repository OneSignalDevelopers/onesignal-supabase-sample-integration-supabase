import Stripe from "https://esm.sh/stripe@10.13.0?target=deno&deno-std=0.165.0"

const secretKey = Deno.env.get("STRIPE_SECRET_KEY") ?? ""
export const stripe = Stripe(secretKey, {
  httpClient: Stripe.createFetchHttpClient(),
  apiVersion: "2022-08-01",
})
