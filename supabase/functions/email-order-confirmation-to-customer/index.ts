import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import * as OneSignal from "https://esm.sh/@onesignal/node-onesignal@1.0.0-beta7"
import { onesignal, _OnesignalAppId_ } from "../_utils/config.ts"
import { getCustomerProfile } from "../_utils/supabase.ts"
import { generateEmailMessage } from "../_utils/helpers.ts"

serve(async (req) => {
  try {
    const { record } = await req.json()
    const customerId = record.stripe_customer_id
    const profile = await getCustomerProfile(customerId)
    if (!profile) {
      throw Error(`No profile found for Stripe customer ${customerId}.`)
    }

    console.log(`Found profile for customer '${customerId}'.`, profile)

    // Create message object
    const message: OneSignal.Notification = {
      app_id: _OnesignalAppId_,
      include_email_tokens: [profile.email],
      email_subject: "You order confirmation",
      email_body: generateEmailMessage(record.amount, record.currency),
    }

    const onesignalApiRes = await onesignal.createNotification(message)

    return new Response(
      JSON.stringify({ onesignalResponse: onesignalApiRes }),
      {
        headers: { "Content-Type": "application/json" },
      }
    )
  } catch (err) {
    console.error("Failed to create OneSignal notification", err)
    return new Response("Server error.", {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})
