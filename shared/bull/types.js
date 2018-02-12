// @flow
import type {
  DBThread,
  DBInvoice,
  DBReaction,
  DBChannel,
  DBMessage,
  DBUser,
  DBCommunity,
} from '../types';

type Job<JobData> = {
  data: JobData,
};

interface BullQueue<JobData> {
  add: (data: JobData) => Promise<any>;
  process: (
    cb: (job: Job<JobData>, done: Function) => void | Promise<any>
  ) => void;
}

export type Queues = {
  // athena
  sendThreadNotificationQueue: BullQueue<{ thread: DBThread }>,
  sendCommunityNotificationQueue: BullQueue<{
    communityId: string,
    userId: string,
  }>,
  trackUserThreadLastSeenQueue: BullQueue<{
    threadId: string,
    userId: string,
    timestamp: number | Date,
  }>,
  sendProInvoicePaidNotificationQueue: BullQueue<{ invoice: DBInvoice }>,
  sendCommunityInvoicePaidNotificationQueue: BullQueue<{ invoice: DBInvoice }>,
  sendReactionNotificationQueue: BullQueue<{
    reaction: DBReaction,
    userId: string,
  }>,
  sendPrivateChannelRequestQueue: BullQueue<{
    userId: string,
    channel: DBChannel,
  }>,
  sendPrivateChannelInviteNotificationQueue: BullQueue<{
    recipient: { email: string, firstName?: ?string, lastName?: ?string },
    channelId: string,
    senderId: string,
    customMessage?: ?string,
  }>,
  sendCommunityInviteNotificationQueue: BullQueue<{
    recipient: { email: string, firstName?: ?string, lastName?: ?string },
    communityId: string,
    senderId: string,
    customMessage?: ?string,
  }>,
  sendChannelNotificationQueue: BullQueue<{
    channel: DBChannel,
    userId: string,
  }>,
  sendDirectMessageNotificationQueue: BullQueue<{
    message: DBMessage,
    userId: string,
  }>,
  sendMessageNotificationQueue: BullQueue<{ message: DBMessage }>,

  // hermes
  sendNewUserWelcomeEmailQueue: BullQueue<{ user: DBUser }>,
  sendNewCommunityWelcomeEmailQueue: BullQueue<{
    user: DBUser,
    community: DBCommunity,
  }>,
  sendEmailValidationEmailQueue: BullQueue<{ email: string, userId: string }>,

  // mercury
  processReputationEventQueue: BullQueue<{
    userId: string,
    type: string,
    entityId: string,
  }>,

  // admin
  _adminSendCommunityCreatedEmailQueue: BullQueue<{
    user: DBUser,
    community: DBCommunity,
  }>,
  _adminProcessToxicMessageQueue: BullQueue<{ message: DBMessage }>,
  _adminProcessToxicThreadQueue: BullQueue<{ thread: DBMessage }>,
  _adminProcessSlackImportQueue: BullQueue<{
    thisUser: DBUser,
    community: DBCommunity,
    invitedCount: number,
    teamName: string,
  }>,
};
