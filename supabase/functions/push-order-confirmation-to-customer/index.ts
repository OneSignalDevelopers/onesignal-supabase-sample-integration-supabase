import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import * as OneSignal from "https://esm.sh/@onesignal/node-onesignal@1.0.0-beta7"
import { onesignal, _OnesignalAppId_ } from "../_utils/config.ts"
import { getCustomerProfile } from "../_utils/supabase.ts"

const generateMessage = (amount: number, currency: string) =>
  `You just spent ${amount / 100} ${(currency as String).toUpperCase()}.`

serve(async (req) => {
  try {
    const { record } = await req.json()
    const customerId = record.stripe_customer_id
    const profile: string | null = await getCustomerProfile(customerId)
    if (!profile) {
      throw Error(`No profile found for Stripe customer ${customerId}.`)
    }

    // Build OneSignal notification object
    const notification = new OneSignal.Notification()
    notification.app_id = _OnesignalAppId_
    notification.include_external_user_ids = [profile]
    notification.contents = {
      en: generateMessage(record.amount, record.currency),
    }
    const onesignalApiRes = await onesignal.createNotification(notification)

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
