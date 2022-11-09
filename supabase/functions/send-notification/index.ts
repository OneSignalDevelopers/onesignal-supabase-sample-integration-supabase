import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import * as OneSignal from "https://esm.sh/@onesignal/node-onesignal@1.0.0-beta4"

serve(async (req) => {
  // Load secrets
  const appId = Deno.env.get("APP_ID")!
  const userAuthKey = Deno.env.get("USER_AUTH_KEY")!
  const restApiKey = Deno.env.get("REST_API_KEY")!

  // Create OneSignal client
  const configuration = OneSignal.createConfiguration({
    authMethods: {
      user_key: {
        tokenProvider: {
          getToken: () => userAuthKey,
        },
      },
      app_key: {
        tokenProvider: {
          getToken: () => restApiKey,
        },
      },
    },
  })
  const client = new OneSignal.DefaultApi(configuration)

  try {
    const { name } = await req.json()

    // Build OneSignal notification object
    const notification = new OneSignal.Notification()
    notification.contents = {
      en: name,
    }
    notification.included_segments = ["Subscribed Users"]
    notification.is_ios = false

    // Call OneSignal API to push notification
    const res = await client.createNotification(notification)

    return new Response(JSON.stringify(res), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    return new Response(
      JSON.stringify({
        appId,
        userAuthKey,
        restApiKey,
        error: err,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 400,
      }
    )
  }
})
