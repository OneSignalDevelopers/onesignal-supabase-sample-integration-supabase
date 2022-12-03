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

# OneSignal + Supabase Sample Omni-channel Integration
OneSignal makes engaging customers simple and is the fastest, most reliable service to send push notifications, in-app messages, SMS, and emails.

This project demonstrates how to use OneSignal as an integration with [Supabase](https://supabase.com) to handle your messaging needs, including push notifications, SMS text messages, email, and in-app messaging. Feel free to use this sample as a reference for your own Supabase integration.

## 🚦 Getting started

This project assumes that you already have a few things setup.

- An existing OneSignal account. If not, [create one for free](https://dashboard.onesignal.com/signup).
- A Supabase account and the [Supabase CLI](https://supabase.com/docs/guides/cli#installation) [v1.16.0](https://www.npmjs.com/package/supabase/v/1.16.0) installed.
- A Firebase account, if not [create one first](https://firebase.google.com/).
- A Stripe account and the [Stripe CLI](https://stripe.com/docs/stripe-cli) v1.13.5 installed.
- A Vercel account and the [Vercel CLI](https://vercel.com/docs/cli#) [v28.7.0](https://www.npmjs.com/package/vercel/v/28.7.0) installed (or anything capable of hosting a Next.js API).
- A working Flutter dev environment and access to a mac for iOS-specific steps.
- [Deno](https://github.com/denoland/deno_install) v1.28.0 installed.

## Setup OneSignal App

1. From the OneSignal Dashboard, select **New App/Website** to create an app.
![Select New App/Website to create new app](assets/configure-android/01-create-new-app.png)
2. Name app and choose the **Android** platform to setup. ![Onesignal platform configuration](assets/configure-android/02-configure-android.png)
3. Enter FCM credentials for the Firebase project you want to handle Android notifications and choose **Save & Continue**. ![FCM configuration form](assets/configure-android/03-save-fcm-details.png)

### Setup iOS Platform

iOS configuration requires substantially more effort to integrate due to needing signed certs from Apple. Due to this fact, follow [this guide](https://github.com/OneSignalDevelopers/OneSignal-Flutter-Sample/blob/main/docs/obtaining-ios-push-cert.md) for detailed instructions on creating the certificate needed to use Apple's Push Notification Service ([APNs](https://developer.apple.com/documentation/usernotifications/registering_your_app_with_apns)).

After you have the certificate, head to the OneSignal Dashboard

1. Choose **Settings -> Platforms**
2. **Activate** the iOS card
![Platform settings](assets/configure-ios/01-activate-apple-platform.png)
3. Upload your certificate and enter the password you used to encrypt it. If you didn't set a password, leave the password input blank. ![Apple iOS (APNs) Configuration form](assets/configure-ios/02-apns-configuration.png)

### Craft an In-App Message

Consent is required before we can present push notifications to a user. It's recommend to use an in-app message to ask for consent because no prior consent is needed to present them. This is particularly useful in situations where a user accidentally declines consent. We have an in-depth guide explaining this strategy [here](https://documentation.onesignal.com/docs/how-to-prompt-for-push-permissions-with-an-in-app-message).

1. Select **New Message -> New In-App** and name it "prompt_notification" ![Select new in app message](assets/create-in-app-message/01-select-new-in-app-message.png)

2. Configure an in-app message with at least one button; here's the message with two buttons I configured for this sample using our Block Editor! ![Example in-app message](assets/create-in-app-message/02-configure-in-app-message-1.png)

3. Add the _Push Permission Prompt_ **Click Action** to the primary call to action button. ![Adding a cliock action](assets/create-in-app-message/03-add-click-action.png)

4. Select **Add Trigger -> In-App Trigger** to present the in-app message when specific conditions are met ![Adding in-app trigger](assets/create-in-app-message/04-add-trigger.png)

5. Schedule the message to start showing **Immediately**, to **Show forever**, and to show **Every time trigger conditions are satisfied**

6. Select **Make Message Live** to publish message

If you didn't name your in-app message "prompt_notification", you'll need to update the [Flutter app's code](https://github.com/OneSignalDevelopers/onesignal-supabase-sample-integration-app/blob/main/README.md#triggering-an-in-app-message) to use your name.

## Setup Supabase Project

### Initialize Supabase project

Run this command to interactively configure a new Supabase project

```sh
supabase projects create onesignal-supabase-sample-integration -i
```

[![asciicast](https://asciinema.org/a/NxhyWy8OKco1O91H5oHFqzykY.svg)](https://asciinema.org/a/NxhyWy8OKco1O91H5oHFqzykY)

### Disable email confirmation authentication

![Disable Supabase email confirmation](/assets/aux/disabling-email-confirmation.gif)

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

https://github.com/OneSignalDevelopers/onesignal-supabase-sample-integration-supabase/blob/12df6f502b73050cad18ea04712a3b8362b47853/supabase/functions/_utils/config.ts#L2

Deno's `Deno.env` object exposes the values we need.

https://github.com/OneSignalDevelopers/onesignal-supabase-sample-integration-supabase/blob/12df6f502b73050cad18ea04712a3b8362b47853/supabase/functions/_utils/config.ts#L5-L7

Create the OneSignal API client so we can send a request to the API.

https://github.com/OneSignalDevelopers/onesignal-supabase-sample-integration-supabase/blob/12df6f502b73050cad18ea04712a3b8362b47853/supabase/functions/_utils/config.ts#L12

Now we can configure the notification object.
https://github.com/OneSignalDevelopers/onesignal-supabase-sample-integration-supabase/blob/12df6f502b73050cad18ea04712a3b8362b47853/supabase/functions/push-order-confirmation-to-customer/index.ts#L24-L29

And send the notification to OneSignal to send the push notification.

https://github.com/OneSignalDevelopers/onesignal-supabase-sample-integration-supabase/blob/12df6f502b73050cad18ea04712a3b8362b47853/supabase/functions/push-order-confirmation-to-customer/index.ts#L30

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

For complete instructions on creating a webhooks, please refer to the [Supabase docs](/assets/webhook-setup/02-select-create-a-new-webhook.png).

![Sample hook](/assets/webhook-setup/03-select-confirm.png)

1. From the Database -> Webhooks page Select **Create a new hook** button
2. Name the hook "push-order-confirmation-to-user"
3. Set the table to `orders`
4. Select **Insert** checkbox
5. Set hook type to HTTP Request
6. Set the HTTP request method to **POST**
7. Set the URL to the edge function, `push-order-confirmation-to-customer`
8. Add a HTTP Header named `Authorization` and set the value to `Bearer [Your Supabase project's anonKey]`
9. Select **Confirm** confirm button to complete setup

💡We need to include the Authorization header so the edge function can verify the request. Without this header, anyone would be able to call our endpoint.

## 🚀🚀🚀 Launch Companion App

The [companion app](https://github.com/onesignaldevelopers/onesignal-supabase-sample-integration-app) can be built from source to run alongside this Supabase project.

![App demo](/assets/aux/push-notification-demo.gif)

### Debugging

The [Supabase dashboard](https://app.supabase.com/) presents all deployed functions along with their time of deployment and status.

![Functions deployed to production](assets/edge-functions.png)

#### Inspect Supabase Edge Function Requests

Supabase enables you to review HTTP request logs to assist with our debugging.

![Inspecting function requests](assets/edge-function-invocations.gif)

#### Review Server Logs

Our `console.logs` will appear here!

![Reviewing function logs](assets/edge-function-logs.gif)

---

###### Current OneSignal channels Implemented

- [x] Mobile Push Notifications
- [ ] Web Push Notifications (planned)
- [ ] SMS Text Messages (planned)
- [ ] Email (planed)
- [x] In-app Messages

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
