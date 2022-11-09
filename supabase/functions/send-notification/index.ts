// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.131.0/http/server.ts"
import * as OneSignal from "https://esm.sh/@onesignal/node-onesignal@1.0.0-beta4"

const configuration = OneSignal.createConfiguration({
  authMethods: {
    user_key: {
      tokenProvider: {
        getToken: () => Deno.env.get("USER_AUTH_KEY")!,
      },
    },
    app_key: {
      tokenProvider: {
        getToken: () => Deno.env.get("APP_ID")!,
      },
    },
  },
})

const client = new OneSignal.DefaultApi(configuration)

serve(async (req) => {
  try {
    const { name } = await req.json()
    const notification = new OneSignal.Notification()
    notification.contents = {
      en: name,
    }

    const res = await client.createNotification(notification)
    console.info(`Notification sent to ${res.recipients} devices`)

    return new Response(JSON.stringify(res), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (err) {
    console.error(err)

    return new Response(JSON.stringify({ app_id: Deno.env.get("APP_ID") }), {
      headers: { "Content-Type": "application/json" },
      status: 400,
    })
  }
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
