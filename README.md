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
* Supabase CLI installed on your system. If you don't have the CLI installed on your system, head to the [Supabase CLI docs](https://supabase.com/docs/guides/cli#installation) for instructions to get started.

---

## Initialize Supabase Project

```bash
╭─iamwill@kronos ~/code/@onesignalDevelopers/onesignal-supabase-edge-function-sample ‹main●›
╰─$ supabase projects create onesignal-supabase-edge-function-sample -i
```

[![asciicast](https://asciinema.org/a/NxhyWy8OKco1O91H5oHFqzykY.svg)](https://asciinema.org/a/NxhyWy8OKco1O91H5oHFqzykY)

## Create Edge Function

```bash
╭─iamwill@kronos ~/code/@onesignalDevelopers/onesignal-supabase-edge-function-sample ‹main●›
╰─$ supabase functions new onesignal-push-message
```

[![asciicast](https://asciinema.org/a/K0YebFw4ciC5uH5OJUn3oATqv.svg)](https://asciinema.org/a/K0YebFw4ciC5uH5OJUn3oATqv)

```md
1. Step 1
2. Step 2
3. Step 3
```

[☝️ replace with actual steps]

[Add relevant code snippets or additional context if necessary]

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
