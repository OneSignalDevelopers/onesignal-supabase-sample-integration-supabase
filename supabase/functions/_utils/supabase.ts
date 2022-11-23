import Stripe from "https://esm.sh/stripe@10.13.0?target=deno&deno-std=0.165.0"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.0.0"

import {
  _SupabaseUrl_,
  _SupabaseServiceRoleKey_,
  _StripeSecretKey_,
} from "./config.ts"
import { Database } from "./db_types.ts"

const supabaseAdmin = createClient<Database>(
  _SupabaseUrl_,
  _SupabaseServiceRoleKey_
)

const stripe = Stripe(_StripeSecretKey_, {
  httpClient: Stripe.createFetchHttpClient(),
})

export const createOrRetrieveCustomer = async (authHeader: string) => {
  try {
    const jwt = authHeader.replace("Bearer ", "")
    const {
      data: { user },
    } = await supabaseAdmin.auth.getUser(jwt)

    if (!user) {
      throw new Error("No user found for JWT!")
    }

    // Check if the user already has a Stripe customer ID in the Database.
    const { data, error } = await supabaseAdmin
      .from("customers")
      .select("stripe_customer_id")
      .eq("id", user?.id)
    if (error) {
      console.error(
        "Failed checking for Stripe customer existence in Supabase ",
        { data, error }
      )
      throw error
    }

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

      console.log(`New customer "${user.id}" created for user "${user.id}"`)

      await supabaseAdmin
        .from("customers")
        .insert({ id: user.id, stripe_customer_id: customer.id })
        .throwOnError()

      return customer.id
    }

    throw new Error(
      `Unexpected number of customer rows: ${data?.length}. Expected 0 or 1.`
    )
  } catch (e) {
    console.error("Error `createOrRetrieveCustomer`: ", { error: e })
  }
}
