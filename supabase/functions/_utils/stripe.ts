import Stripe from "https://esm.sh/stripe@10.13.0?target=deno&deno-std=0.165.0"
import { _StripeSecretKey_ } from "../_utils/config.ts"

export const stripe = Stripe(_StripeSecretKey_, {
  httpClient: Stripe.createFetchHttpClient(),
})
