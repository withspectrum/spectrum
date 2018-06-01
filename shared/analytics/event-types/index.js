// @flow
import * as channelEvents from './channel'
import * as communityEvents from './community'
import * as directMessageEvents from './directMessage'
import * as directMessageThreadsEvents from './directMessageThreads'
import * as emailsEvents from './emails'
import * as messageEvents from './message'
import * as miscEvents from './misc'
import * as navigationEvents from './navigation'
import * as notificationsEvents from './notifications'
import * as pageExploreEvents from './page-explore'
import * as pageFeatureEvents from './page-features'
import * as pageHomeEvents from './page-home'
import * as pageAppsEvents from './page-apps'
import * as pageInboxEvents from './page-inbox'
import * as pageLoginEvents from './page-login'
import * as pagePricingEvents from './page-pricing'
import * as pageSupportEvents from './page-support'
import * as pwaEvents from './pwa'
import * as reactionEvents from './reaction'
import * as searchEvents from './search'
import * as threadEvents from './thread'
import * as userEvents from './user'
import * as userOnboardingEvents from './userOnboarding'
import * as webPushNotificationEvents from './web-push-notification'

export const events = {
  ...channelEvents,
  ...communityEvents,
  ...directMessageEvents,
  ...directMessageThreadsEvents,
  ...emailsEvents,
  ...messageEvents,
  ...miscEvents,
  ...navigationEvents,
  ...notificationsEvents,
  ...pageExploreEvents,
  ...pageFeatureEvents,
  ...pageHomeEvents,
  ...pageAppsEvents,
  ...pageInboxEvents,
  ...pageLoginEvents,
  ...pagePricingEvents,
  ...pageSupportEvents,
  ...pagePricingEvents,
  ...pwaEvents,
  ...reactionEvents,
  ...searchEvents,
  ...threadEvents,
  ...userEvents,
  ...userOnboardingEvents,
  ...webPushNotificationEvents,
}