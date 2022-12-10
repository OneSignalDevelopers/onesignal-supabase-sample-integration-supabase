import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import * as OneSignal from "https://esm.sh/@onesignal/node-onesignal@1.0.0-beta7"
import { onesignal, _OnesignalAppId_ } from "../_utils/config.ts"

serve(async (req) => {
  // Create OneSignal client

  try {
    const { message } = await req.json()

    // Build OneSignal notification object
    const notification = new OneSignal.Notification()
    notification.app_id = _OnesignalAppId_
    notification.contents = {
      en: message,
    }
    notification.included_segments = ["Subscribed Users"]

    // Call OneSignal API to push notification
    const res = await onesignal.createNotification(notification)
    console.info("Onesignal API", res)

    return new Response(JSON.stringify(res), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(JSON.stringify(err), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})
