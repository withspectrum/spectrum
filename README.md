
# Spectrum

## What is it?
A single place for all the best communities.


## Who is it for?
Nerds, initially (Spec, TeamSketch, Designer Hangout, PixelFireplace, etc...), but expand to pop culture and beyond through that community.


## Why should communities use Spectrum over (Slack/Facebook Groups + Messenger/Twitter DMs/etc)?
- Free public communities
- Free private communities for 503(c) non-profits and educational groups?
- Code of Conduct moderation
- No ads
- Formatted for focused conversations, not static posts or ongoing randomness.


## How does it make money?
- Paid private communities for internal chat ($100/mo fixed pricing?)
- Brand tools ($100/mo fixed pricing?)
  - Custom theming
  - Admin accounts
  - Privacy controls
  - Custom post types
  - Sticky posts
  - Story tags for organization
  - Custom emoji/stickers? (a la Twitch, YouTube, Slack)
  - Unlimited file history? (depending on our data retention policies generally)
- Pro users ($5/mo?)
  - Custom theming
  - Unlimited file history? (depending on our data retention policies generally)
- Patronage tools?
- Marketplace (let users sell to each other)?

## Firebase

Both the realtime database security rules as well as our cloud functions live in this repository. (`rules.json` and `functions/`, respectively)

## Deployment

```sh
npm run use:staging
# To deploy to production: npm run use:prod
npm run deploy:rules
npm run deploy:functions
```
