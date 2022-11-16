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

This project demonstrates sending push notifications using [Edge Functions](https://supabase.com/docs/guides/functions) hosted on Supabase. You can use function implemented in this sample as a reference for using OneSignal in your Supabase deployment.

## 🚦 Getting started

This project assumes that you already have a few things setup
* OneSignal app with push notifications configured. If you don't have one configured, follow these [instructions to create your first app](https://documentation.onesignal.com/docs/apps-organizations#create-an-app).
* Mobile app with OneSignal integrated. If you don't have OneSignal integrated in your app, then follow the steps for [Android](https://documentation.onesignal.com/docs/android-sdk-setup) or [iOS](https://documentation.onesignal.com/docs/ios-sdk-setup) to get your app setup to receive notifications from OneSignal.
* Supabase CLI installed on your system. If you don't have the CLI installed on your system, head to the [Supabase CLI docs](https://supabase.com/docs/guides/cli#installation) for instructions to get started (this sample uses [v1.14.0](https://www.npmjs.com/package/supabase/v/1.14.0)).
* Deno installed on your system (this sample uses v1.28.0). See [Deno install instructions](https://github.com/denoland/deno_install) for steps to install Deno on your system.

---

## Initialize Supabase Project

```bash
╭─iamwill@kronos ~/code/@onesignalDevelopers/onesignal-supabase-edge-function-sample ‹main●›
╰─$ supabase projects create onesignal-supabase-edge-function-sample -i
```

Entering this command should result in an interactive prompt to configure a new Supabase project as shown below.

[![asciicast](https://asciinema.org/a/NxhyWy8OKco1O91H5oHFqzykY.svg)](https://asciinema.org/a/NxhyWy8OKco1O91H5oHFqzykY)

## Create Edge Function

Note that this sample already includes an implementation of an edge function. The following instructions are simply to explain how to add your own.

```bash
╭─iamwill@kronos ~/code/@onesignalDevelopers/onesignal-supabase-edge-function-sample ‹main●›
╰─$ supabase functions new onesignal-push-message
```

The Supabase CLI's command to create a function will add the boilerplate for an edge function located in a directory with the name specified in the command,  `onesignal-push-message/index.ts`.

[![asciicast](https://asciinema.org/a/K0YebFw4ciC5uH5OJUn3oATqv.svg)](https://asciinema.org/a/K0YebFw4ciC5uH5OJUn3oATqv)

## Writing Logic in Edge Function

Supabase Edge Functions are executed in the Deno enfironment on the edge. This carries a couple of implications

* Functions are written in TypeScript
* You cannot install packages using npm or Yarn

To add to logic to the function, open `onesignal-push-message/index.ts` in your text editor. To start, We'll need to import _onesignal-node-api_, but as previously mentioned, we can't install packages using the typical mechanisms. To get around this, we can use [esm.sh](https://esm.sh) which is a fast, global content delivery network for NPM packages.

We import the OneSignal package by specifying the URL where Deno can download it from.

```ts
import * as OneSignal from "https://esm.sh/@onesignal/node-onesignal@1.0.0-beta7"
```

Importing the package in this way is effective to installing it, so now we can move on to ensuring our script has access to the values needed to intialize the OneSignal API client.

```ts
const appId = Deno.env.get("APP_ID")!
const userAuthKey = Deno.env.get("USER_AUTH_KEY")!
const restApiKey = Deno.env.get("REST_API_KEY")!
```

Deno exposes variables loaded from the environment in the object `Deno.env`. When doing local development, you can set environment variables in a file named `supabase/.env.local`.

Copy the [.env.example](supabase/.env.example) file in this repo and fill in the values with your own from OneSignal.

```bash
╭─iamwill@kronos ~/code/@onesignalDevelopers/onesignal-supabase-edge-function-sample ‹main●›
╰─$ cp supabase/.env.example supabase/.env.local
```

You can set environent variables in the production environment by using the Supabase CLI.

```bash
╭─iamwill@kronos ~/code/@onesignalDevelopers/onesignal-supabase-edge-function-sample ‹main●›
╰─$ supabase secrets set test=123
Finished supabase secrets set.
```

[![asciicast](https://asciinema.org/a/HC1zFYiSHKskmTyD0yG0IVB68.svg)](https://asciinema.org/a/HC1zFYiSHKskmTyD0yG0IVB68)

You can also remove variables in case you make a mistake.

```bash
╭─iamwill@kronos ~/code/@onesignalDevelopers/onesignal-supabase-edge-function-sample ‹main●›
╰─$ supabase secrets unset test
Finished supabase secrets unset.
```

## Deploying

When developing Supabase Edge Functions we have the ability to deploy to a local or production environment. Running in the local environment allows you to easily test and quickly iterate on your implementation.

### Local deployment
To deploy this sample to a local Supabase instance:
1. Start Supabase Docker container, navigate to the root directory of this sample project and run `supabase start`.
2. To serve the function, run `supabase functions serve onesignal-push-message --env-file ./supabase/.env.local --debug`
3. Submit request to the endpoint making sure to use the **anon key** as your bearer token.

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

Once the function is deployed, you can post a request to execute it.

```cURL
# Making request to local Supabase function
curl -X "POST" "http://localhost:54321/functions/v1/onesignal-push-message" \
     -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24ifQ.625_WdcF3KHqz5amU0x2X5WWHP-OEs_4qj0ssLNHzTs' \
     -H 'Content-Type: application/json; charset=utf-8' \
     -d $'{
  "message": "test"
}'
```

### Deploying to production

Supabase makes deploying your project to production simple with their CLI.

```bash
╭─iamwill@kronos ~/code/@onesignalDevelopers/onesignal-supabase-edge-function-sample ‹main●›
╰─$ supabase functions deploy onesignal-push-message
```

# ❤️ Developer Community

For additional resources, please join the [OneSignal Developer Community](https://onesignal.com/onesignal-developers).

Get in touch with us or learn more about OneSignal through the channels below.

* [Follow us on Twitter](https://twitter.com/onesignaldevs) to never miss any updates from the OneSignal team, ecosystem & community
* [Join us on Discord](https://discord.gg/EP7gf6Uz7G) to be a part of the OneSignal Developers community, showcase your work and connect with other OneSignal developers
* [Read the OneSignal Blog](https://onesignal.com/blog/) for the latest announcements, tutorials, in-depth articles & more.
* [Subscribe to us on YouTube](https://www.youtube.com/channel/UCe63d5EDQsSkOov-bIE_8Aw/featured) for walkthroughs, courses, talks, workshops & more.
* [Follow us on Twitch](https://www.twitch.tv/onesignaldevelopers) for live streams, office hours, support & more.

## Show your support

Give a ⭐️ if this project helped you, and watch this repo to stay up to date.
