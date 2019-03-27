// @flow
/*

  The purpose of this is file is to share flowtypes of our database records across
  API and our workers. When type checking results directly from a database query,
  attempt to use or update the types here

*/
import type { MessageType } from 'shared/draft-utils/message-types';

export type DBChannel = {
  communityId: string,
  createdAt: Date,
  deletedAt?: Date,
  deletedBy?: string,
  description: string,
  id: string,
  isDefault: boolean,
  isPrivate: boolean,
  name: string,
  slug: string,
  archivedAt?: Date,
  memberCount: number,
};

export type DBCommunity = {
  coverPhoto: string,
  createdAt: Date,
  description: string,
  id: string,
  name: string,
  profilePhoto: string,
  slug: string,
  website?: ?string,
  deletedAt?: Date,
  deletedBy?: string,
  pinnedThreadId?: string,
  watercoolerId?: string,
  creatorId: string,
  administratorEmail: ?string,
  pendingAdministratorEmail?: string,
  isPrivate: boolean,
  memberCount: number,
};

export type DBCommunitySettings = {
  id: string,
  communityId: string,
  brandedLogin: ?{
    customMessage: ?string,
  },
  slackSettings: ?{
    connectedAt: ?string,
    connectedBy: ?string,
    invitesSentAt: ?string,
    teamName: ?string,
    teamId: ?string,
    scope: ?string,
    token: ?string,
    invitesMemberCount: ?string,
    invitesCustomMessage: ?string,
  },
  joinSettings: {
    tokenJoinEnabled: boolean,
    token: ?string,
  },
};

export type DBChannelSettings = {
  id: string,
  channelId: string,
  joinSettings?: {
    tokenJoinEnabled: boolean,
    token: string,
  },
  slackSettings?: {
    botLinks: {
      threadCreated: ?string,
    },
  },
};

export type DBCuratedContent = {
  type: string,
  id: string,
  data: any,
};

export type DBDirectMessageThread = {
  createdAt: Date,
  id: string,
  name?: string,
  threadLastActive: Date,
};

type DBMessageEdits = {
  content: {
    body: string,
  },
  timestamp: string,
};

export type DBMessage = {
  content: {
    body: string,
  },
  id: string,
  messageType: MessageType,
  senderId: string,
  deletedAt?: Date,
  deletedBy?: string,
  threadId: string,
  threadType: 'story' | 'directMessageThread',
  timestamp: Date,
  parentId?: string,
  edits?: Array<DBMessageEdits>,
  modifiedAt?: string,
};

export type NotificationPayloadType =
  | 'REACTION'
  | 'THREAD_REACTION'
  | 'MESSAGE'
  | 'THREAD'
  | 'CHANNEL'
  | 'COMMUNITY'
  | 'USER'
  | 'DIRECT_MESSAGE_THREAD';

export type NotificationEventType =
  | 'REACTION_CREATED'
  | 'THREAD_REACTION_CREATED'
  | 'MESSAGE_CREATED'
  | 'THREAD_CREATED'
  | 'CHANNEL_CREATED'
  | 'DIRECT_MESSAGE_THREAD_CREATED'
  | 'USER_JOINED_COMMUNITY'
  | 'USER_REQUESTED_TO_JOIN_PRIVATE_CHANNEL'
  | 'USER_APPROVED_TO_JOIN_PRIVATE_CHANNEL'
  | 'THREAD_LOCKED_BY_OWNER'
  | 'THREAD_DELETED_BY_OWNER'
  | 'COMMUNITY_INVITE'
  | 'MENTION_THREAD'
  | 'MENTION_MESSAGE'
  | 'PRIVATE_CHANNEL_REQUEST_SENT'
  | 'PRIVATE_CHANNEL_REQUEST_APPROVED'
  | 'PRIVATE_COMMUNITY_REQUEST_SENT'
  | 'PRIVATE_COMMUNITY_REQUEST_APPROVED';

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

export type DBThreadReaction = {
  id: string,
  threadId: string,
  createdAt: Date,
  type: ReactionType,
  deletedAt?: Date,
  score?: number,
  scoreUpdatedAt?: Date,
  userId: string,
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
    body?: any,
    title: string,
  },
  timestamp: Date,
};

export type DBThread = {
  id: string,
  channelId: string,
  communityId: string,
  content: {
    body?: any,
    title: string,
  },
  createdAt: Date,
  creatorId: string,
  isPublished: boolean,
  isLocked: boolean,
  lockedBy?: string,
  lockedAt?: Date,
  editedBy?: string,
  lastActive: Date,
  modifiedAt?: Date,
  deletedAt?: string,
  deletedBy: ?string,
  attachments?: Array<DBThreadAttachment>,
  edits?: Array<DBThreadEdits>,
  watercooler?: boolean,
  messageCount: number,
  reactionCount: number,
  type: string,
};

export type DBUser = {
  id: string,
  email?: string,
  createdAt: string,
  name: string,
  coverPhoto: string,
  profilePhoto: string,
  providerId?: ?string,
  githubProviderId?: ?string,
  githubUsername?: ?string,
  fbProviderId?: ?string,
  googleProviderId?: ?string,
  username: ?string,
  timezone?: ?number,
  isOnline?: boolean,
  lastSeen?: ?string,
  description?: ?string,
  website?: ?string,
  modifiedAt: ?string,
  betaSupporter?: boolean,
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
  isPending: boolean,
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

export type DBNotificationsJoin = {
  ...$Exact<DBUsersNotifications>,
  ...$Exact<DBNotification>,
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
      newMention: NotificationSetting,
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
  lastSeen?: Date | number,
};

export type SearchThread = {
  channelId: string,
  communityId: string,
  creatorId: string,
  lastActive: number,
  messageContent: {
    body: ?string,
  },
  threadContent: {
    title: string,
    body: ?string,
  },
  createdAt: number,
  threadId: string,
  objectID: string,
};

export type SearchUser = {
  description: ?string,
  name: string,
  username: ?string,
  website: ?string,
  objectID: string,
};

export type SearchCommunity = {
  description: ?string,
  name: string,
  slug: string,
  website: ?string,
  objectID: string,
};

export type DBExpoPushSubscription = {
  id: string,
  token: string,
  userId: string,
};

export type FileUpload = {
  filename: string,
  mimetype: string,
  encoding: string,
  stream: any,
};

export type EntityTypes = 'communities' | 'channels' | 'users' | 'threads';

export type DBCoreMetric = {
  dau: number,
  wau: number,
  mau: number,
  dac: number,
  dacSlugs: Array<string>,
  wac: number,
  wacSlugs: Array<string>,
  mac: number,
  macSlugs: Array<string>,
  cpu: number,
  mpu: number,
  tpu: number,
  users: number,
  communities: number,
  threads: number,
  dmThreads: number,
};
