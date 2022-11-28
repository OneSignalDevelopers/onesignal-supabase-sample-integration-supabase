import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import * as OneSignal from "https://esm.sh/@onesignal/node-onesignal@1.0.0-beta7"

serve(async (req) => {
  // Load secrets
  const appId = Deno.env.get("ONESIGNAL_APP_ID")!
  const userAuthKey = Deno.env.get("USER_AUTH_KEY")!
  const restApiKey = Deno.env.get("ONESIGNAL_REST_API_KEY")!

  // Create OneSignal client
  const configuration = OneSignal.createConfiguration({
    userKey: userAuthKey,
    appKey: restApiKey,
  })
  const client = new OneSignal.DefaultApi(configuration)

  try {
    const { message } = await req.json()

    // Build OneSignal notification object
    const notification = new OneSignal.Notification()
    notification.app_id = appId
    notification.contents = {
      en: message,
    }
    notification.included_segments = ["Subscribed Users"]

    // Call OneSignal API to push notification
    const res = await client.createNotification(notification)
    console.log("OneSignal response -", res)

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
