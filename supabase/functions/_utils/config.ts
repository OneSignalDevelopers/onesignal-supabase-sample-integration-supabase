import Stripe from "https://esm.sh/stripe@10.13.0?target=deno&deno-std=0.165.0"

export const _SupabaseUrl_ = Deno.env.get("SUPABASE_URL")!
export const _SupabaseServiceRoleKey_ = Deno.env.get(
  "SUPABASE_SERVICE_ROLE_KEY"
)!
export const _StripePublishableKey_ = Deno.env.get("STRIPE_PUBLISHABLE_KEY")!
export const _StripeEndpointSecret_ = Deno.env.get("STRIPE_ENDPOINT_SECRET")!

const stripeSecretKey = Deno.env.get("STRIPE_SECRET_KEY")!
export const stripe = Stripe(stripeSecretKey, {
  httpClient: Stripe.createFetchHttpClient(),
})

// For debugging environment
console.log("Runtime environmentDeno\n\t", Deno.env.toObject())
