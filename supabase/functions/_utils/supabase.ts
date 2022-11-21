import { Database } from "./db_types.ts"
import { stripe } from "./stripe.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0"

// WARNING: The service role key has admin priviliges and should only be used in secure server environments!
const url = Deno.env.get("SUPABASE_URL") ?? ""
const serviceRolekey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
const supabaseAdmin = createClient<Database>(url, serviceRolekey)

export const createOrRetrieveCustomer = async (authHeader: string) => {
  const jwt = authHeader.replace("Bearer ", "")
  const {
    data: { user },
  } = await supabaseAdmin.auth.getUser(jwt)
  if (!user) throw new Error("No user found for JWT!")

  // Check if the user already has a Stripe customer ID in the Database.
  const { data, error } = await supabaseAdmin
    .from("customers")
    .select("stripe_customer_id")
    .eq("id", user?.id)

  console.log(data?.length, data, error)

  if (error) throw error
  if (data?.length === 1) {
    // Exactly one customer found, return it.
    const customer = data[0].stripe_customer_id
    console.log(`Found customer id: ${customer}`)
    return customer
  }

  if (data?.length === 0) {
    // Create customer object in Stripe.
    const customer = await stripe.customers.create({
      email: user.email,
      metadata: { uid: user.id },
    })

    console.log(`New customer "${customer.id}" created for user "${user.id}"`)

    await supabaseAdmin
      .from("customers")
      .insert({ id: user.id, stripe_customer_id: customer.id })
      .throwOnError()
    return customer.id
  } else throw new Error(`Unexpected count of customer rows: ${data?.length}`)
}
