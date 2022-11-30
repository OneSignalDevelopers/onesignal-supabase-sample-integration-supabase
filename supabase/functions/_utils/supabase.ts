import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0"

import { _SupabaseUrl_, _SupabaseServiceRoleKey_, stripe } from "./config.ts"
import { Database } from "./db_types.ts"

const supabaseClient = createClient<Database>(
  _SupabaseUrl_,
  _SupabaseServiceRoleKey_
)

export const getStripeCustomer = async (authHeader: string) => {
  try {
    const jwt = authHeader.replace("Bearer ", "")
    const {
      data: { user },
    } = await supabaseClient.auth.getUser(jwt)

    if (!user) {
      throw new Error("No user found for JWT!")
    }

    // Check if the user already has a Stripe customer ID in the Database.
    const { data, error } = await supabaseClient
      .from("customers")
      .select("stripe_customer_id")
      .eq("id", user?.id)
    if (error) {
      console.error(
        "Failed checking for Stripe customer existence in Supabase ",
        error
      )
      throw error
    }

    if (data?.length === 1) {
      console.log("Data", data)
      // Exactly one customer found, return it.
      const stripeCustomerId = data[0].stripe_customer_id
      console.log(`Found existing customer: ${stripeCustomerId}`)
      return stripeCustomerId
    }

    if (data?.length === 0) {
      // Create customer object in Stripe.
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: { uid: user.id },
      })
      console.log(`Created new stripe customer`, customer)

      await supabaseClient
        .from("customers")
        .insert({ id: user.id, stripe_customer_id: customer.id })
        .throwOnError()
      console.log(`Saved customer "${customer.id}"`)

      await supabaseClient
        .from("profiles")
        .update({ stripe_customer_id: customer.id })
        .eq("id", user.id)
        .throwOnError()
      console.log(
        `Updated profile for user ${user.id} with stripe details`,
        customer
      )

      return customer.id
    }

    throw new Error(
      `Unexpected number of customer rows: ${data?.length}. Expected 0 or 1.`
    )
  } catch (e) {
    console.error("Error `createOrRetrieveCustomer`: ", { error: e })
  }
}

export const getCustomerProfile = async (customerId: string) => {
  console.info(`Getting customer profile for ${customerId}`)
  try {
    const result = await supabaseClient
      .from("profiles")
      .select("id")
      .eq("stripe_customer_id", customerId)
    if (result.error) {
      console.error("Error loading profile", result.error.message)
      return null
    }

    console.log("Results", result)

    return result.data[0].id
  } catch (error) {
    console.error("Could not load customer profile", error)
  }
}
