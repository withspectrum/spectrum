// @flow
import type {
  DBThread,
  DBInvoice,
  DBReaction,
  DBChannel,
  DBMessage,
  DBUser,
  DBCommunity,
  DBNotificationsJoin,
} from '../types';
import type { RawSource } from '../stripe/types/source';
import type { RawCharge } from '../stripe/types/charge';
import type { RawInvoice } from '../stripe/types/invoice';

export type Job<JobData> = {
  id: string,
  data: JobData,
};

type JobOptions = {
  jobId?: number | string,
  removeOnComplete?: boolean,
  removeOnFail?: boolean,
};

interface BullQueue<JobData> {
  add: (data: JobData, options?: JobOptions) => Promise<any>;
  process: (
    cb: (job: Job<JobData>, done: Function) => void | Promise<any>
  ) => void;
}

export type SendNewThreadNotificationEmailJobData = {
  recipient: {
    id: string,
    email: string,
    username: string,
  },
  primaryActionLabel: string,
  thread: {
    community: {
      id: string,
      slug: string,
      profilePhoto: string,
      name: string,
    },
    creator: {
      profilePhoto: string,
      username: string,
      name: string,
    },
    channel: {
      id: string,
      name: string,
    },
    id: string,
    content: {
      title: string,
      body?: string,
    },
  },
};

export type SendPrivateChannelRequestApprovedEmailJobData = {
  recipient: {
    email: string,
  },
  channel: {
    name: string,
    slug: string,
  },
  community: {
    name: string,
    slug: string,
  },
};

export type SendPrivateChannelRequestEmailJobData = {
  recipient: {
    email: string,
  },
  user: {
    username: string,
    name: string,
  },
  channel: {
    name: string,
    slug: string,
  },
  community: {
    name: string,
    slug: string,
  },
};

export type SendNewMessageMentionEmailJobData = {
  recipient: DBUser,
  sender: DBUser,
  thread: DBThread,
  message: DBMessage,
};

export type SendNewThreadMentionEmailJobData = {
  recipient: DBUser,
  sender: DBUser,
  thread: DBThread,
};

type ReplyData = {
  sender: {
    name: string,
    username: string,
    profilePhoto: string,
  },
  content: {
    body: string,
  },
};

type ThreadData = {
  id: string,
  content: {
    title: string,
  },
  community: {
    slug: string,
    name: string,
  },
  channel: {
    name: string,
  },
  replies: Array<ReplyData>,
  repliesCount: number,
};

export type SendNewMessageEmailJobData = {
  recipient: {
    userId: string,
    email: string,
    username: string,
  },
  threads: Array<ThreadData>,
};

export type SendNewDirectMessageEmailJobData = {
  recipient: {
    email: string,
    name: string,
    username: string,
    userId: string,
  },
  user: {
    displayName: string,
    username: string,
    id: string,
    name: string,
  },
  thread: {
    content: {
      title: string,
    },
    path: string,
    id: string,
  },
  message: {
    content: {
      body: string,
    },
  },
};

export type MentionNotificationJobData = {
  messageId?: string, // This is only set if it's a message mention notification
  threadId: string, // This is always set, no matter if it's a message or thread mention notification
  senderId: string,
  username: ?string,
  type: 'message' | 'thread',
};

export type ChannelNotificationJobData = {
  channel: DBChannel,
  userId: string,
};

export type ThreadNotificationJobData = { thread: DBThread };

export type CommunityNotificationJobData = {
  communityId: string,
  userId: string,
};

export type UserThreadLastSeenJobData = {
  threadId: string,
  userId: string,
  timestamp: number | Date,
};

export type InvoiceJobData = { invoice: DBInvoice };

export type ReactionNotificationJobData = {
  reaction: DBReaction,
  userId: string,
};

export type PrivateChannelRequestJobData = {
  userId: string,
  channel: DBChannel,
};

export type PrivateChannelInviteNotificationJobData = {
  recipient: { email: string, firstName?: ?string, lastName?: ?string },
  channelId: string,
  senderId: string,
  customMessage?: ?string,
};

export type CommunityInviteNotificationJobData = {
  recipient: { email: string, firstName?: ?string, lastName?: ?string },
  communityId: string,
  senderId: string,
  customMessage?: ?string,
};

export type DirectMessageNotificationJobData = {
  message: DBMessage,
  userId: string,
};

export type MessageNotificationJobData = { message: DBMessage };

export type NewUserWelcomeEmailJobData = { user: DBUser };

export type NewCommunityWelcomeEmailJobData = {
  user: DBUser,
  community: DBCommunity,
};

export type SlackImportJobData = {
  token: string,
  importId: string,
};

export type EmailValidationEmailJobData = { email: string, userId: string };

export type AdministratorEmailValidationEmailJobData = {
  email: string,
  userId: string,
  communityId: string,
  community: DBCommunity,
};

export type ReputationEventJobData = {
  userId: string,
  type: string, // TODO: Type this with the actual possible types
  entityId: string,
};

export type StripeWebhookEventJobData = {
  record: Object,
  type?: string,
};

export type StripeCommunityPaymentEventJobData = {
  communityId: string,
};

export type StripePaymentSucceededOrFailedEventJobData = {
  record: RawCharge | RawInvoice,
};

export type AdminCommunityCreatedEmailJobData = {
  user: DBUser,
  community: DBCommunity,
};

export type AdminToxicMessageJobData = { message: DBMessage };

export type AdminToxicThreadJobData = { thread: DBThread };

export type AdminSlackImportJobData = {
  thisUser: DBUser,
  community: DBCommunity,
  invitedCount: number,
  teamName: string,
};

export type PushNotificationsJobData = {
  // This gets passed a join of the userNotification and the notification record
  notification: DBNotificationsJoin,
};

export type PaymentSucceededEmailJobData = {
  invoice: Object,
  community: DBCommunity,
  source: Object,
  to: string,
};

export type PaymentFailedEmailJobData = {
  charge: Object,
  community: DBCommunity,
  to: string,
};

export type CardExpiringWarningEmailJobData = {
  source: RawSource,
  community: DBCommunity,
  to: string,
};

export type StripeCardExpiringWarningJobData = {
  record: Object,
};

export type Queues = {
  // athena
  sendThreadNotificationQueue: BullQueue<ThreadNotificationJobData>,
  sendCommunityNotificationQueue: BullQueue<CommunityNotificationJobData>,
  trackUserThreadLastSeenQueue: BullQueue<UserThreadLastSeenJobData>,
  sendProInvoicePaidNotificationQueue: BullQueue<InvoiceJobData>,
  sendCommunityInvoicePaidNotificationQueue: BullQueue<InvoiceJobData>,
  sendReactionNotificationQueue: BullQueue<ReactionNotificationJobData>,
  sendPrivateChannelRequestQueue: BullQueue<PrivateChannelRequestJobData>,
  sendPrivateChannelInviteNotificationQueue: BullQueue<
    PrivateChannelInviteNotificationJobData
  >,
  sendCommunityInviteNotificationQueue: BullQueue<
    CommunityInviteNotificationJobData
  >,
  sendChannelNotificationQueue: BullQueue<ChannelNotificationJobData>,
  sendDirectMessageNotificationQueue: BullQueue<
    DirectMessageNotificationJobData
  >,
  sendMessageNotificationQueue: BullQueue<MessageNotificationJobData>,
  sendMentionNotificationQueue: BullQueue<MentionNotificationJobData>,
  sendNotificationAsPushQueue: BullQueue<PushNotificationsJobData>,
  slackImportQueue: BullQueue<SlackImportJobData>,

  // hermes
  sendNewUserWelcomeEmailQueue: BullQueue<NewUserWelcomeEmailJobData>,
  sendNewCommunityWelcomeEmailQueue: BullQueue<NewCommunityWelcomeEmailJobData>,
  sendEmailValidationEmailQueue: BullQueue<EmailValidationEmailJobData>,
  sendAdministratorEmailValidationEmailQueue: BullQueue<
    AdministratorEmailValidationEmailJobData
  >,
  sendCommunityPaymentSucceededEmailQueue: BullQueue<
    PaymentSucceededEmailJobData
  >,
  sendCommunityPaymentFailedEmailQueue: BullQueue<PaymentFailedEmailJobData>,
  sendCommunityCardExpiringWarningEmailQueue: BullQueue<
    CardExpiringWarningEmailJobData
  >,
  sendNewMessageEmailQueue: BullQueue<SendNewMessageEmailJobData>,
  sendNewDirectMessageEmailQueue: BullQueue<SendNewDirectMessageEmailJobData>,
  sendNewMentionMessageEmailQueue: BullQueue<SendNewMessageMentionEmailJobData>,
  sendNewMentionThreadEmailQueue: BullQueue<SendNewThreadMentionEmailJobData>,
  sendPrivateChannelRequestEmailQueue: BullQueue<
    SendPrivateChannelRequestEmailJobData
  >,
  sendPrivateChannelRequestApprovedEmailQueue: BullQueue<
    SendPrivateChannelRequestApprovedEmailJobData
  >,
  sendThreadCreatedNotificationEmailQueue: BullQueue<
    SendNewThreadNotificationEmailJobData
  >,

  // mercury
  processReputationEventQueue: BullQueue<ReputationEventJobData>,

  // pluto
  stripeChargeWebhookEventQueue: BullQueue<StripeWebhookEventJobData>,
  stripeCustomerWebhookEventQueue: BullQueue<StripeWebhookEventJobData>,
  stripeSourceWebhookEventQueue: BullQueue<StripeWebhookEventJobData>,
  stripeInvoiceWebhookEventQueue: BullQueue<StripeWebhookEventJobData>,
  stripeSubscriptionWebhookEventQueue: BullQueue<StripeWebhookEventJobData>,
  stripeDiscountWebhookEventQueue: BullQueue<StripeWebhookEventJobData>,
  stripeCommunityAdministratorEmailChangedQueue: BullQueue<
    StripeCommunityPaymentEventJobData
  >,
  stripeCommunityAnalyticsAddedQueue: BullQueue<
    StripeCommunityPaymentEventJobData
  >,
  stripeCommunityAnalyticsRemovedQueue: BullQueue<
    StripeCommunityPaymentEventJobData
  >,
  stripeCommunityCreatedQueue: BullQueue<StripeCommunityPaymentEventJobData>,
  stripeCommunityDeletedQueue: BullQueue<StripeCommunityPaymentEventJobData>,
  stripeCommunityEditedQueue: BullQueue<StripeCommunityPaymentEventJobData>,
  stripeCommunityModeratorAddedQueue: BullQueue<
    StripeCommunityPaymentEventJobData
  >,
  stripeCommunityModeratorRemovedQueue: BullQueue<
    StripeCommunityPaymentEventJobData
  >,
  stripeCommunityPrioritySupportAddedQueue: BullQueue<
    StripeCommunityPaymentEventJobData
  >,
  stripeCommunityPrioritySupportRemovedQueue: BullQueue<
    StripeCommunityPaymentEventJobData
  >,
  stripeCommunityPrivateChannelAddedQueue: BullQueue<
    StripeCommunityPaymentEventJobData
  >,
  stripeCommunityPrivateChannelRemovedQueue: BullQueue<
    StripeCommunityPaymentEventJobData
  >,
  stripeCommunityOpenSourceStatusActivatedQueue: BullQueue<
    StripeCommunityPaymentEventJobData
  >,
  stripeCommunityOpenSourceStatusEnabledQueue: BullQueue<
    StripeCommunityPaymentEventJobData
  >,
  stripeCommunityOpenSourceStatusDisabledQueue: BullQueue<
    StripeCommunityPaymentEventJobData
  >,
  stripePaymentSucceededQueue: BullQueue<
    StripePaymentSucceededOrFailedEventJobData
  >,
  stripePaymentFailedQueue: BullQueue<
    StripePaymentSucceededOrFailedEventJobData
  >,
  stripeCardExpiringWarningQueue: BullQueue<StripeCardExpiringWarningJobData>,

  // admin
  _adminSendCommunityCreatedEmailQueue: BullQueue<
    AdminCommunityCreatedEmailJobData
  >,
  _adminProcessToxicMessageQueue: BullQueue<AdminToxicMessageJobData>,
  _adminProcessToxicThreadQueue: BullQueue<AdminToxicThreadJobData>,
  _adminProcessSlackImportQueue: BullQueue<AdminSlackImportJobData>,
};
