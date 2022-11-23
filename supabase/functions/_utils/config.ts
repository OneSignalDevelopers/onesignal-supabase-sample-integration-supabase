export const _SupabaseUrl_ = Deno.env.get("SUPABASE_URL") ?? ""
export const _SupabaseServiceRoleKey_ =
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
export const _StripePublishableKey_ =
  Deno.env.get("STRIPE_PUBLISHABLE_KEY") ?? ""

export const _StripeSecretKey_ = Deno.env.get("STRIPE_SECRET_KEY") ?? ""

export const _StripeEndpointSecret_ =
  Deno.env.get("STRIPE_ENDPOINT_SECRET") ?? ""

// For debugging environment
// console.log("Runtime environmentDeno\n\t", Deno.env.toObject())
