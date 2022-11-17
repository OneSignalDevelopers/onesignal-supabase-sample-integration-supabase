![OneSignal](https://github.com/OneSignal/.github/blob/439e36ade56b001643ff3b07eeaf95b20129f3e6/assets/onesignal-banner.png)

<div align="center">
  <a href="https://documentation.onesignal.com/docs/onboarding-with-onesignal" target="_blank">Quickstart</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://onesignal.com/" target="_blank">Website</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://documentation.onesignal.com/docs" target="_blank">Docs</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="https://github.com/OneSignalDevelopers" target="_blank">Examples</a>
  <br />
  <hr />
</div>

# OneSignal Supabase Edge Function Integration Sample

OneSignal makes engaging customers simple and is the fastest, most reliable service to send push notifications, in-app messages, SMS, and emails.

This project demonstrates how to send a push notification from a [Supabase Edge Function](https://supabase.com/docs/guides/functions). Use this sample integration as a reference for your own edge function implementation.

## 🚦 Getting started

This project assumes that you already have a few things setup.

- [OneSignal app](https://documentation.onesignal.com/docs/apps-organizations#create-an-app) created.
- [Android](https://documentation.onesignal.com/docs/android-sdk-setup) or [iOS](https://documentation.onesignal.com/docs/ios-sdk-setup) app integrated with a [OneSignal SDK](https://github.com/onesignal/sdks).
- [Supabase CLI](https://supabase.com/docs/guides/cli#installation) [v1.14.0](https://www.npmjs.com/package/supabase/v/1.14.0) installed.
- [Deno](https://github.com/denoland/deno_install) v1.28.0 installed.

---

## How to Initialize the Supabase Project

```bash
╭─iamwill@kronos ~/code/@onesignalDevelopers/onesignal-supabase-edge-function-sample ‹main●›
╰─$ supabase projects create onesignal-supabase-edge-function-sample -i
```

Entering this command should result in an interactive prompt to configure a new Supabase project, as shown below.

[![asciicast](https://asciinema.org/a/NxhyWy8OKco1O91H5oHFqzykY.svg)](https://asciinema.org/a/NxhyWy8OKco1O91H5oHFqzykY)

## How to Create the Function

Note that this sample already includes an implementation of an edge function. The following instructions are simply to explain how to add your own.

```bash
╭─iamwill@kronos ~/code/@onesignalDevelopers/onesignal-supabase-edge-function-sample ‹main●›
╰─$ supabase functions new push
```

The Supabase CLI's command to create a function will add the boilerplate for an edge function located in a directory with the name specified in the command, `push/index.ts`.

[![asciicast](https://asciinema.org/a/K0YebFw4ciC5uH5OJUn3oATqv.svg)](https://asciinema.org/a/K0YebFw4ciC5uH5OJUn3oATqv)

## Function Implementation

Supabase Edge Functions are executed in the Deno enfironment on the edge which means:

- Functions are written in TypeScript
- You can't install packages with a package manager like npm or Yarn

Function logic is implemented in `push/index.ts`.

I can't use a traditional package manager to install packages, so I'm using [esm.sh](https://esm.sh) – a global CDN for npm packages – to load the `onesignal-node-api` module.

```ts
import * as OneSignal from "https://esm.sh/@onesignal/node-onesignal@1.0.0-beta7"
```

I can load environment variables exposed in Deno's `Deno.env` object.

```ts
const appId = Deno.env.get("APP_ID")!
const userAuthKey = Deno.env.get("USER_AUTH_KEY")!
const restApiKey = Deno.env.get("REST_API_KEY")!
```

I have to create a OneSignal API client before sending a request to the API.

```ts
// Create OneSignal client
const configuration = OneSignal.createConfiguration({
  userKey: userAuthKey,
  appKey: restApiKey,
})
const client = new OneSignal.DefaultApi(configuration)
```

And a notification.

```ts
const notification = new OneSignal.Notification()
notification.app_id = appId
notification.contents = {
  en: message,
}
notification.included_segments = ["Subscribed Users"]
```

Then I can use the API client to submit my request to create the push notification.

```ts
const res = await client.createNotification(notification)
```

### How to Set Environment Variables

#### On Local

Supabase will respect local environment variables set in `supabase/.env.local`.

Copy [.env.example](supabase/.env.example) and fill in your keys from OneSignal app.

```bash
╭─iamwill@kronos ~/code/@onesignalDevelopers/onesignal-supabase-edge-function-sample ‹main●›
╰─$ cp supabase/.env.example supabase/.env.local
```

#### On Supabase

Use the Supabase CLI to set environment variables in the Supabase project.

```bash
╭─iamwill@kronos ~/code/@onesignalDevelopers/onesignal-supabase-edge-function-sample ‹main●›
╰─$ supabase secrets set test=123
Finished supabase secrets set.
```

[![asciicast](https://asciinema.org/a/HC1zFYiSHKskmTyD0yG0IVB68.svg)](https://asciinema.org/a/HC1zFYiSHKskmTyD0yG0IVB68)

#### How to Remove Variable

Use the Supabase CLI to remove environmental variables in the Supabase project.

```bash
╭─iamwill@kronos ~/code/@onesignalDevelopers/onesignal-supabase-edge-function-sample ‹main●›
╰─$ supabase secrets unset test
Finished supabase secrets unset.
```

## How to Deploy Function

When developing Supabase Edge Functions, we can deploy to a local or production environment. Local function development allows you to iterate quickly and efficiently to test the function.

### Serve Locally

1. Start the Supabase Docker container, navigate to the root directory of this sample project and run `supabase start`.
2. To serve the function, run `supabase functions serve push --env-file ./supabase/.env.local --debug`
3. Submit a request to the endpoint making sure to use the **anon key** as your bearer token.

Result of running `supabase start`

```bash
╭─iamwill@kronos ~/code/@onesignalDevelopers/onesignal-supabase-edge-function-sample ‹main●›
╰─$ supabase start                                                                                                                                                1 ↵
Seeding data supabase/seed.sql...
Started supabase local development setup.

API URL: http://localhost:54321
DB URL: postgresql://postgres:postgres@localhost:54322/postgres
Studio URL: http://localhost:54323
Inbucket URL: http://localhost:54324
JWT secret: super-secret-jwt-token-with-at-least-32-characters-long
anon key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSJ9.vI9obAHOGyVVKa3pD--kJlyxp-Z2zV9UUMAhKpNLAcU
```

Serving a function to the local instance of Supabase.

[![asciicast](https://asciinema.org/a/xfO8bL75esZJjVDqnbzmgfUEV.svg)](https://asciinema.org/a/xfO8bL75esZJjVDqnbzmgfUEV)

### To Production

Supabase makes deploying your project to production simple with their CLI.

```bash
╭─iamwill@kronos ~/code/@onesignalDevelopers/onesignal-supabase-edge-function-sample ‹main●›
╰─$ supabase functions deploy push
```

If the command ☝️ doesn't work for you, try executing the command with the `--legacy-bundle` flag set.

[![asciicast](https://asciinema.org/a/nHeUle77fZcsoyXAMzwcB3329.svg)](https://asciinema.org/a/nHeUle77fZcsoyXAMzwcB3329)

## How to the Test

Submit an HTTP request to the function.

```bash
# HTTP request to local function
curl -X "POST" "http://localhost:54321/functions/v1/push" \
     -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "message": "Local function test"
}'
```

![Local function response](assets/testing-local-function.gif)

## How to Debug

The [Supabase dashboard](https://app.supabase.com/) presents all deployed functions along with their time of deployment and status.

![Functions deployed to production](assets/edge-functions.png)

### How to Inspect the HTTP Request

![Inspecting function requests](assets/edge-function-invocations.gif)

#### How to Review the Response

![Reviewing function logs](assets/edge-function-logs.gif)

# ❤️ Developer Community

For additional resources, please join the [OneSignal Developer Community](https://onesignal.com/onesignal-developers).

Get in touch with us or learn more about OneSignal through the channels below.

- [Follow us on Twitter](https://twitter.com/onesignaldevs) to never miss any updates from the OneSignal team, ecosystem & community
- [Join us on Discord](https://discord.gg/EP7gf6Uz7G) to be a part of the OneSignal Developers community, showcase your work and connect with other OneSignal developers
- [Read the OneSignal Blog](https://onesignal.com/blog/) for the latest announcements, tutorials, in-depth articles & more.
- [Subscribe to us on YouTube](https://www.youtube.com/channel/UCe63d5EDQsSkOov-bIE_8Aw/featured) for walkthroughs, courses, talks, workshops & more.
- [Follow us on Twitch](https://www.twitch.tv/onesignaldevelopers) for live streams, office hours, support & more.

## Show your support

Give a ⭐️ if this project helped you, and watch this repo to stay up to date.
