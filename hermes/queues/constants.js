// @flow
const IS_PROD = !process.env.FORCE_DEV && process.env.NODE_ENV === 'production';

export const SEND_NEW_MESSAGE_EMAIL = 'send new message email';
export const SEND_NEW_DIRECT_MESSAGE_EMAIL = 'send new direct message email';
export const SEND_COMMUNITY_INVITE_EMAIL = 'send community invite email';
export const SEND_NEW_USER_WELCOME_EMAIL = 'send new user welcome email';
export const SEND_NEW_COMMUNITY_WELCOME_EMAIL =
  'send new community welcome email';
export const SEND_COMMUNITY_INVOICE_RECEIPT_EMAIL =
  'send community invoice receipt email';
export const SEND_PRO_INVOICE_RECEIPT_EMAIL = 'send pro invoice receipt email';
export const SEND_THREAD_CREATED_NOTIFICATION_EMAIL =
  'send thread created notification email';
export const SEND_DIGEST_EMAIL = 'send digest email';
export const SEND_EMAIL_VALIDATION_EMAIL = 'send email validation email';
export const SEND_ADMIN_COMMUNITY_CREATED_EMAIL = 'admin community created';
export const SEND_NEW_MENTION_THREAD_EMAIL = 'send thread mention email';
export const SEND_NEW_MENTION_MESSAGE_EMAIL = 'send message mention email';

export const NEW_MESSAGE_TEMPLATE = 2266041;
export const NEW_MENTION_THREAD_TEMPLATE = IS_PROD ? 3776541 : 3844623;
export const NEW_MENTION_MESSAGE_TEMPLATE = IS_PROD ? 3844364 : 3844624;
export const NEW_DIRECT_MESSAGE_TEMPLATE = 2911541;
export const NEW_USER_WELCOME_TEMPLATE = 2462726;
export const COMMUNITY_INVITE_TEMPLATE = 2302401;
export const NEW_COMMUNITY_WELCOME_TEMPLATE = 2600301;
export const COMMUNITY_INVOICE_RECEIPT_TEMPLATE = 2647483;
export const PRO_INVOICE_RECEIPT_TEMPLATE = 3037461;
export const NEW_THREAD_CREATED_TEMPLATE = IS_PROD ? 2713302 : 3786781;
export const DIGEST_TEMPLATE = 3071361;
export const DEBUG_TEMPLATE = 3374841;
export const EMAIL_VALIDATION_TEMPLATE = 3578681;
export const ADMIN_COMMUNITY_CREATED_TEMPLATE = 3037441;

// types used to generate unsubscribe tokens
export const TYPE_DAILY_DIGEST = 'dailyDigest';
export const TYPE_WEEKLY_DIGEST = 'weeklyDigest';
export const TYPE_NEW_THREAD_CREATED = 'newThreadCreated';
export const TYPE_NEW_MESSAGE_IN_THREAD = 'newMessageInThreads';
export const TYPE_NEW_DIRECT_MESSAGE = 'newDirectMessage';
export const TYPE_NEW_MENTION = 'newMention';
export const TYPE_MUTE_CHANNEL = 'muteChannel';
export const TYPE_MUTE_COMMUNITY = 'muteCommunity';
export const TYPE_MUTE_THREAD = 'muteThread';
export const TYPE_MUTE_DIRECT_MESSAGE_THREAD = 'muteDirectMessageThread';
