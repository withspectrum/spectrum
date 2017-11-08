// @flow
/*

  The purpose of this is file is to share flowtypes of our database records across
  Iris and our workers. When type checking results directly from a database query,
  attempt to use or update the types here

*/

export type DBChannel = {
  communityId: string,
  createdAt: Date,
  deletedAt?: Date,
  description: string,
  id: string,
  isDefault: boolean,
  isPrivate: boolean,
  name: string,
  slug: string,
};

export type DBCommunity = {
  coverPhoto: string,
  createdAt: Date,
  description: string,
  id: string,
  name: string,
  profilePhoto: string,
  slug: string,
  website?: string,
  deletedAt?: Date,
  pinnedThreadId?: string,
};

export type DBDirectMessageThread = {
  createdAt: Date,
  id: string,
  name?: string,
  threadLastActive: Date,
};

export type DBInvoice = {
  amount: number,
  chargeId: string,
  communityId?: string,
  customerId: string,
  id: string,
  paidAt: Date,
  planId: 'beta-pro' | 'community-standard',
  planName: string,
  quantity: number,
  soruceBrand: string,
  sourceLast4: string,
  status: string,
  subscriptionId: string,
  userId: string,
};

export type DBMessage = {
  content: {
    body: string,
  },
  id: string,
  messageType: 'text' | 'media' | 'draftjs',
  senderId: string,
  deletedAt?: Date,
  threadId: string,
  threadType: 'story' | 'directMessageThread',
  timestamp: Date,
};

export type NotificationPayloadType =
  | 'REACTION'
  | 'MESSAGE'
  | 'THREAD'
  | 'CHANNEL'
  | 'COMMUNITY'
  | 'USER'
  | 'DIRECT_MESSAGE_THREAD';

export type NotificationEventType =
  | 'REACTION_CREATED'
  | 'MESSAGE_CREATED'
  | 'THREAD_CREATED'
  | 'THREAD_EDITED'
  | 'CHANNEL_CREATED'
  | 'DIRECT_MESSAGE_THREAD_CREATED'
  | 'USER_JOINED_COMMUNITY'
  | 'USER_REQUESTED_TO_JOIN_PRIVATE_CHANNEL'
  | 'USER_APPROVED_TO_JOIN_PRIVATE_CHANNEL'
  | 'THREAD_LOCKED_BY_OWNER'
  | 'THREAD_DELETED_BY_OWNER'
  | 'COMMUNITY_INVITATION';

type NotificationPayload = {
  id: string,
  payload: string,
  type: NotificationPayloadType,
};
export type DBNotification = {
  id: string,
  actors: Array<NotificationPayload>,
  context: NotificationPayload,
  createdAt: Date,
  entities: Array<NotificationPayload>,
  event: NotificationEventType,
  modifiedAt: Date,
};

type ReactionType = 'like';
export type DBReaction = {
  id: string,
  messageId: string,
  timestamp: Date,
  type: ReactionType,
  userId: string,
};

export type DBRecurringPayment = {
  id: string,
  amount: number,
  canceledAt?: Date,
  createdAt: Date,
  currentPeriodEnd: Date,
  currentPeriodStart: Date,
  customerId: string,
  planId: 'beta-pro' | 'community-standard',
  planName: string,
  quantity: number,
  sourceBrand: string,
  sourceLast4: string,
  status: 'active' | 'canceled',
  subscriptionId: string,
  userId: string,
  communityId?: string,
};

export type DBReputationEvent = {
  communityId: string,
  id: string,
  score: number,
  timestamp: Date,
  type: string,
  userId: string,
};

export type DBSlackUser = {
  email: string,
  firstName: string,
  lastName: string,
};
export type DBSlackImport = {
  id: string,
  communityId: string,
  members?: Array<DBSlackUser>,
  senderId?: string,
  teamId: string,
  teamName: string,
  token: string,
};

type DBThreadAttachment = {
  attachmentType: 'photoPreview',
  data: {
    name: string,
    type: string,
    url: string,
  },
};

type DBThreadEdits = {
  attachment?: {
    photos: Array<DBThreadAttachment>,
  },
  content: {
    body?: string,
    title: string,
  },
  timestamp: Date,
};

export type DBThread = {
  channelId: string,
  communityId: string,
  content: {
    body?: string,
    title: string,
  },
  createdAt: Date,
  creatorId: string,
  isPublished: boolean,
  lastActive: Date,
  modifiedAt?: Date,
  attachments?: Array<DBThreadAttachment>,
  edits?: Array<DBThreadEdits>,
};

export type DBUser = {
  id: string,
  email?: string,
  createdAt: Date,
  name: string,
  coverPhoto: string,
  profilePhoto: string,
  providerId?: string,
  githubProviderId?: string,
  fbProviderId?: string,
  googleProviderId?: string,
  username?: string,
  timezone?: number,
  isOnline?: boolean,
  lastSeen?: Date,
};

export type DBUsersChannels = {
  id: string,
  channelId: string,
  createdAt: Date,
  isBlocked: boolean,
  isMember: boolean,
  isModerator: boolean,
  isOwner: boolean,
  isPending: boolean,
  receiveNotifications: boolean,
  userId: string,
};

export type DBUsersCommunities = {
  id: string,
  communityId: string,
  createdAt: Date,
  isBlocked: boolean,
  isMember: boolean,
  isModerator: boolean,
  isOwner: boolean,
  receiveNotifications: boolean,
  reputation: number,
  userId: string,
};

export type DBUsersDirectMessageThreads = {
  id: string,
  createdAt: Date,
  lastActive?: Date,
  lastSeen?: Date,
  receiveNotifications: boolean,
  threadId: string,
  userId: string,
};

export type DBUsersNotifications = {
  id: string,
  createdAt: Date,
  entityAddedAt: Date,
  isRead: boolean,
  isSeen: boolean,
  notificationId: string,
  userId: string,
};

type NotificationSetting = { email: boolean };
export type DBUsersSettings = {
  id: string,
  userId: string,
  notifications: {
    types: {
      dailyDigest: NotificationSetting,
      newDirectMessage: NotificationSetting,
      newMessageInThreads: NotificationSetting,
      newThreadCreated: NotificationSetting,
      weeklyDigest: NotificationSetting,
    },
  },
};

export type DBUsersThreads = {
  id: string,
  createdAt: Date,
  isParticipant: boolean,
  receiveNotifications: boolean,
  threadId: string,
  userId: string,
};
