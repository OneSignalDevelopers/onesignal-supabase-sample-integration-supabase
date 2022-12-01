import Stripe from "https://esm.sh/stripe@10.13.0?target=deno&deno-std=0.165.0"
import * as OneSignal from "https://esm.sh/@onesignal/node-onesignal@1.0.

// OneSignal
export const _OnesignalAppId_ = Deno.env.get("ONESIGNAL_APP_ID")!
const _OnesignalUserAuthKey_ = Deno.env.get("USER_AUTH_KEY")!
export const _OnesignalRestApiKey_ = Deno.env.get("ONESIGNAL_REST_API_KEY")!

const configuration = OneSignal.createConfiguration({
  userKey: _OnesignalUserAuthKey_,
  appKey: _OnesignalAppId_,
})
export const onesignal = new OneSignal.DefaultApi(configuration)

// Supabase
export const _SupabaseUrl_ = Deno.env.get("SUPABASE_URL")!
export const _SupabaseServiceRoleKey_ = Deno.env.get(
  "SUPABASE_SERVICE_ROLE_KEY"
)!

// Stripe
export const _StripePublishableKey_ = Deno.env.get("STRIPE_PUBLISHABLE_KEY")!
export const _StripeWebhookSecret_ = Deno.env.get("STRIPE_WEBHOOK_SECRET")!
const _stripeSecretKey_ = Deno.env.get("STRIPE_SECRET_KEY")!
export const stripe = Stripe(_stripeSecretKey_, {
  httpClient: Stripe.createFetchHttpClient(),
})

// For debugging environment
// console.log("Runtime environmentDeno\n\t", Deno.env.toObject())
