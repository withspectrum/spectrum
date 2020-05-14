// @flow
import type {
  DBThread,
  DBReaction,
  DBThreadReaction,
  DBChannel,
  DBMessage,
  DBUser,
  DBCommunity,
  DBNotification,
  DBNotificationsJoin,
  FileUpload,
} from '../types';
import type {
  Recipient,
  NewMessageNotificationEmailThread,
} from 'athena/queues/new-message-in-thread/buffer-email';
import type { CleanDigestThread, Timeframe } from 'chronos/types';

export type Job<JobData> = {|
  id: string,
  data: JobData,
  remove: () => Promise<void>,
  finished: () => Promise<void>,
|};

export type JobOptions = {|
  jobId?: number | string,
  delay?: number,
  removeOnComplete?: boolean,
  removeOnFail?: boolean,
  attempts?: number,
  repeat?: {
    cron: string,
    tz: 'America/Los_Angeles',
  },
|};

interface BullQueue<JobData> {
  add: (data: JobData, options?: JobOptions) => Promise<any>;
  process: (
    cb: (job: Job<JobData>, done: Function) => void | Promise<any>
  ) => void;
  getJob: (id: string) => Promise<Job<JobData> | null>;
}

export type BufferNewMessageEmailJobData = {
  threads: Array<NewMessageNotificationEmailThread>,
  notifications: Array<DBNotification>,
  recipient: Recipient,
  firstTimeout: number,
};

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

export type SendPrivateCommunityRequestApprovedEmailJobData = {
  recipient: {
    email: string,
  },
  community: {
    name: string,
    slug: string,
  },
};

export type SendPrivateCommunityRequestEmailJobData = {
  recipient: {
    email: string,
  },
  user: {
    username: string,
    name: string,
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
  recipient: Recipient,
  threads: Array<ThreadData>,
};

export type SendNewDirectMessageEmailJobData = {
  recipient: {
    email: string,
    name: string,
    username: ?string,
    userId: string,
  },
  user: {
    username: ?string,
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

export type ReactionNotificationJobData = {
  reaction: DBReaction,
  userId: string,
};

export type ThreadReactionNotificationJobData = {
  threadReaction: DBThreadReaction,
  userId: string,
};

export type PrivateChannelRequestJobData = {
  userId: string,
  channel: DBChannel,
};

export type PrivateChannelRequestApprovedJobData = {
  userId: string,
  channelId: string,
  communityId: string,
  moderatorId: string,
};

export type PrivateCommunityRequestJobData = {
  userId: string,
  communityId: string,
};

export type PrivateCommunityRequestApprovedJobData = {
  userId: string,
  communityId: string,
  moderatorId: string,
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

export type AdminCommunityCreatedEmailJobData = {
  user: DBUser,
  community: DBCommunity,
};

export type AdminToxicMessageJobData = { message: DBMessage };

export type AdminToxicThreadJobData = { thread: DBThread };

export type AdminSlackImportJobData = {
  user: DBUser,
  community: DBCommunity,
  invitedCount: number,
  teamName: string,
};

type Attachment = {
  attachmentType: string,
  data: string,
};

type File = FileUpload;

type PublishingThreadType = {
  channelId: string,
  communityId: string,
  type: 'SLATE' | 'DRAFTJS',
  content: {
    title: string,
    body?: string,
  },
  attachments?: ?Array<Attachment>,
  filesToUpload?: ?Array<File>,
};

export type AdminUserSpammingThreadsJobData = {
  user: DBUser,
  threads: Array<?DBThread>,
  publishing: PublishingThreadType,
  community: DBCommunity,
  channel: DBChannel,
};

export type PushNotificationsJobData = {
  // This gets passed a join of the userNotification and the notification record
  notification: DBNotificationsJoin,
};

export type SendSlackInvitationsJobData = {
  communityId: string,
  userId: string,
};

export type AdminProcessUserReportedJobData = {
  userId: string,
  reason: string,
  reportedBy: string,
  reportedAt: Date,
};

export type CalculateThreadScoreJobData = {
  threadId: string,
};

export type SearchIndexJobData = {
  id: string,
  type: 'message' | 'thread' | 'user' | 'community',
  event: 'created' | 'edited' | 'deleted' | 'moved',
};

export type AdminActiveCommunityReportEmailJobData = {
  dacCount: number,
  wacCount: number,
  macCount: number,
  newDac: Array<string>,
  newWac: Array<string>,
  newMac: Array<string>,
  lostDac: Array<string>,
  lostWac: Array<string>,
  lostMac: Array<string>,
};

export type ProcessIndividualDigestJobData = {
  userId: string,
  topCommunityIds: Array<string>,
  timeframe: Timeframe,
};

export type SendDigestEmailJobData = {
  email: ?string,
  userId: string,
  username: ?string,
  user: DBUser,
  threads: Array<CleanDigestThread>,
  reputationString: string,
  communities: ?Array<DBCommunity>,
  timeframe: Timeframe,
  hasOverflowThreads: boolean,
};

export type SendGridWebhookEventJobData = {
  event: {
    email: string,
    timestamp: number,
    event: string,
    category: string,
    sg_event_id: string,
    sg_message_id: string,
    response: string,
    status: string,
    reason: string,
    attempt: string,
  },
};

export type AdminToxicContentEmailJobData = {
  type: string,
  text: string,
  user: DBUser,
  thread: DBThread,
  community: DBCommunity,
  channel: DBChannel,
  toxicityConfidence: {
    perspectiveScore: number,
  },
};

export type Queues = {
  // athena
  sendThreadNotificationQueue: BullQueue<ThreadNotificationJobData>,
  sendCommunityNotificationQueue: BullQueue<CommunityNotificationJobData>,
  trackUserThreadLastSeenQueue: BullQueue<UserThreadLastSeenJobData>,
  sendReactionNotificationQueue: BullQueue<ReactionNotificationJobData>,
  sendThreadReactionNotificationQueue: BullQueue<ThreadReactionNotificationJobData>,
  sendPrivateChannelRequestQueue: BullQueue<PrivateChannelRequestJobData>,
  sendPrivateChannelRequestApprovedQueue: BullQueue<PrivateChannelRequestApprovedJobData>,
  sendPrivateCommunityRequestQueue: BullQueue<PrivateCommunityRequestJobData>,
  sendPrivateCommunityRequestApprovedQueue: BullQueue<PrivateCommunityRequestApprovedJobData>,
  sendPrivateChannelInviteNotificationQueue: BullQueue<PrivateChannelInviteNotificationJobData>,
  sendCommunityInviteNotificationQueue: BullQueue<CommunityInviteNotificationJobData>,
  sendChannelNotificationQueue: BullQueue<ChannelNotificationJobData>,
  sendDirectMessageNotificationQueue: BullQueue<DirectMessageNotificationJobData>,
  sendMessageNotificationQueue: BullQueue<MessageNotificationJobData>,
  sendMentionNotificationQueue: BullQueue<MentionNotificationJobData>,
  sendNotificationAsPushQueue: BullQueue<PushNotificationsJobData>,
  slackImportQueue: BullQueue<SlackImportJobData>,
  sendSlackInvitationsQueue: BullQueue<SendSlackInvitationsJobData>,

  // hermes
  sendNewUserWelcomeEmailQueue: BullQueue<NewUserWelcomeEmailJobData>,
  sendNewCommunityWelcomeEmailQueue: BullQueue<NewCommunityWelcomeEmailJobData>,
  sendEmailValidationEmailQueue: BullQueue<EmailValidationEmailJobData>,
  sendAdministratorEmailValidationEmailQueue: BullQueue<AdministratorEmailValidationEmailJobData>,
  sendNewMessageEmailQueue: BullQueue<SendNewMessageEmailJobData>,
  bufferNewMessageEmailQueue: BullQueue<BufferNewMessageEmailJobData>,
  sendNewDirectMessageEmailQueue: BullQueue<SendNewDirectMessageEmailJobData>,
  sendNewMentionMessageEmailQueue: BullQueue<SendNewMessageMentionEmailJobData>,
  sendNewMentionThreadEmailQueue: BullQueue<SendNewThreadMentionEmailJobData>,
  sendPrivateChannelRequestEmailQueue: BullQueue<SendPrivateChannelRequestEmailJobData>,
  sendPrivateChannelRequestApprovedEmailQueue: BullQueue<SendPrivateChannelRequestApprovedEmailJobData>,
  sendPrivateCommunityRequestEmailQueue: BullQueue<SendPrivateCommunityRequestEmailJobData>,
  sendPrivateCommunityRequestApprovedEmailQueue: BullQueue<SendPrivateCommunityRequestApprovedEmailJobData>,
  sendThreadCreatedNotificationEmailQueue: BullQueue<SendNewThreadNotificationEmailJobData>,
  sendDigestEmailQueue: BullQueue<SendDigestEmailJobData>,
  sendgridEventQueue: BullQueue<SendGridWebhookEventJobData>,

  // mercury
  processReputationEventQueue: BullQueue<ReputationEventJobData>,
  calculateThreadScoreQueue: BullQueue<CalculateThreadScoreJobData>,

  // vulcan
  searchQueue: BullQueue<SearchIndexJobData>,

  // admin
  _adminSendCommunityCreatedEmailQueue: BullQueue<AdminCommunityCreatedEmailJobData>,
  _adminProcessToxicMessageQueue: BullQueue<AdminToxicMessageJobData>,
  _adminProcessToxicThreadQueue: BullQueue<AdminToxicThreadJobData>,
  _adminProcessSlackImportQueue: BullQueue<AdminSlackImportJobData>,
  _adminProcessUserReportedQueue: BullQueue<AdminProcessUserReportedJobData>,
  // TODO: Properly type this
  _adminSendToxicContentEmailQueue: BullQueue<AdminToxicContentEmailJobData>,
  _adminProcessUserSpammingThreadsQueue: BullQueue<AdminUserSpammingThreadsJobData>,
  _adminSendActiveCommunityReportEmailQueue: BullQueue<AdminActiveCommunityReportEmailJobData>,

  // chronos
  weeklyDigestQueue: BullQueue<void>,
  dailyDigestQueue: BullQueue<void>,
  processIndividualDigestQueue: BullQueue<ProcessIndividualDigestJobData>,
  dailyCoreMetricsQueue: BullQueue<void>,
  activeCommunityReportQueue: BullQueue<void>,
  removeSeenUsersNotificationsQueue: BullQueue<void>,
  databaseBackupQueue: BullQueue<void>,
  offsiteBackupQueue: BullQueue<void>,
};
