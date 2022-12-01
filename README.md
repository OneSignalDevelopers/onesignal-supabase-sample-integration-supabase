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

## How to Setup Supabase

### Initialize Supabase project

Run this command to interactively configure a new Supabase project

```sh
supabase projects create onesignal-supabase-sample-integration -i
```

[![asciicast](https://asciinema.org/a/NxhyWy8OKco1O91H5oHFqzykY.svg)](https://asciinema.org/a/NxhyWy8OKco1O91H5oHFqzykY)

### Disable email confirmation authentication

Supabase projects are more secure by default. The front-end client consuming this project does not support magic links. Disabling email confirmation is needed to run the [companion sample app](https://github.com/OneSignalDevelopers/onesignal-supabase-sample-integration-app/blob/main/README.md).

1. From the Supabase Dashboard, navigate to your project's Authenication pane. ![Select Providers on Authentication page](assets/disable-email-confirmation/01-select-providers.png)
2. Select **Providers** under the Configuration header. ![Disable Confirm email](/assets/disable-email-confirmation/02-disable-confirm-email.png)
3. Disable _Confirm email_ and select **Save**.

### Create Edge Function

The Supabase CLI's command to create a function will add the boilerplate for an edge function located in a directory with the name specified in the command, `push/index.ts`.

```bash
supabase functions new push-order-confirmation-to-customer
```

[![asciicast](https://asciinema.org/a/K0YebFw4ciC5uH5OJUn3oATqv.svg)](https://asciinema.org/a/K0YebFw4ciC5uH5OJUn3oATqv)

This function is responsible for calling the OneSignal API using [onesignal-node-sdk](https://www.npmjs.com/package/%40onesignal%2Fnode-onesignal).

#### Function Implementation

Supabase Edge Functions are executed in the Deno enfironment on the edge, so

- Functions are written in TypeScript
- You can't install packages with a package manager like npm or Yarn

Function logic is implemented in `push/index.ts` ([Here](https://github.com/OneSignalDevelopers/onesignal-supabase-sample-integration-supabase/blob/56ba86b8ac7c411d0d81f24f552c89090ea77f7f/supabase/functions/push-order-confirmation-to-customer/index.ts#L26-L39)).

We can't use a traditional package manager to install packages, so we're using [esm.sh](https://esm.sh) – a global CDN for npm packages – to load the [onesignal-node-api](https://www.npmjs.com/package/%40onesignal%2Fnode-onesignal) module.

```ts
import * as OneSignal from "https://esm.sh/@onesignal/node-onesignal@1.0.0-beta7"
```

Deno's `Deno.env` object exposes the values we need.

```ts
export const _OnesignalAppId_ = Deno.env.get("ONESIGNAL_APP_ID")!
const _OnesignalUserAuthKey_ = Deno.env.get("USER_AUTH_KEY")!
export const _OnesignalRestApiKey_ = Deno.env.get("ONESIGNAL_REST_API_KEY")!
const configuration = OneSignal.createConfiguration({
  userKey: _OnesignalUserAuthKey_,
  appKey: _OnesignalAppId_,
})
```

Create the OneSignal API client so we can send a request to the API.

```ts
// Create OneSignal client
export const onesignal = new OneSignal.DefaultApi(configuration)
```

Now we can configure the notification object.

```ts
const notification = new OneSignal.Notification()
notification.app_id = _OnesignalAppId_
notification.include_external_user_ids = [profile]
notification.contents = {
  en: generateMessage(record.amount, record.currency),
}
```

And send the notification to OneSignal to send the push notification.

```ts
const onesignalApiRes =
  await onesignalClient.createNotification(notification)
```

### Set Environment Variables

#### Locally

Supabase will respect local environment variables set in `supabase/.env.local`.

Copy [.env.example](supabase/.env.example) and fill in your keys from OneSignal app.

```bash
$ cp supabase/.env.example supabase/.env.local
```

#### On Supabase

Use the Supabase CLI to set environment variables in the Supabase project.

```bash
$ supabase secrets set test=123
Finished supabase secrets set.
```

[![asciicast](https://asciinema.org/a/HC1zFYiSHKskmTyD0yG0IVB68.svg)](https://asciinema.org/a/HC1zFYiSHKskmTyD0yG0IVB68)

#### How to Remove Variable

Use the Supabase CLI to remove environmental variables in the Supabase project.

```bash
$ supabase secrets unset test
Finished supabase secrets unset.
```

### Run Migrations

💡You only need to run steps 1 since this sample includes migrations files ([here](https://github.com/OneSignalDevelopers/onesignal-supabase-sample-integration-supabase/tree/main/supabase/migrations)).

1. Run `supabase db diff` and copy its output
  [![Generate SQL script for Supabase migration](https://asciinema.org/a/541875.svg)](https://asciinema.org/a/541875)

2. Create a new migration and paste the output from the previous step into the `.sql` file
  [![Create Supabase Migration](https://asciinema.org/a/541879.svg)](https://asciinema.org/a/541879)

3. Run `supabase db push` to apply migrations to the hosted project

### Deploy Edge Function

We can deploy edge functions to a local or production environment. Developing locally allows us to test and iterate quickly.

#### Hosting locally

1. Start the Supabase Docker container, navigate to the root directory of this sample project and run `supabase start`
2. To serve the function, run `supabase functions serve push --env-file ./supabase/.env.local --debug`
3. Submit a request to the endpoint making sure to use the **anon key** as your bearer token.

Result of running `supabase start`

```bash
$ supabase start
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

#### To Production

Supabase makes deploying your project to production simple with their CLI.

```bash
supabase functions deploy push
```

If the command ☝️ doesn't work for you, try executing the command with the `--legacy-bundle` flag set.

[![asciicast](https://asciinema.org/a/nHeUle77fZcsoyXAMzwcB3329.svg)](https://asciinema.org/a/nHeUle77fZcsoyXAMzwcB3329)

### Create Database Webhook

For detailed instructions on creating a webhooks, please refer to the [Supabase docs](/assets/webhook-setup/02-select-create-a-new-webhook.png).

![Database Webhooks page](/assets/webhook-setup/02-select-create-a-new-webhook.png)

1. Select **Create a new hook** button
2. Name the hook "push-order-confirmation-to-user"
3. Set the table to `orders`
4. Select **Insert** checkbox
5. Set hook type to HTTP Request
6. Set the HTTP request method to **POST**
7. Set the URL to the edge function, `push-order-confirmation-to-customer`
8. Add a HTTP Header named `Authorization` and set the value to `Bearer [Your Supabase project's anonKey]`
9. Select **Confirm** confirm button to complete setup ![Review before confirm](/assets/webhook-setup/03-select-confirm.png)

## How to the Test

Submit an HTTP request to the function.

```bash
# HTTP request to local function
curl -X "POST" "http://localhost:54321/functions/v1/send-message-to-all-subs" \
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
