// @flow
const debug = require('debug')('athena');
import createWorker from '../shared/bull/create-worker';
// Our job-processing worker server
import processMessageNotification from './queues/new-message-in-thread';
import processMentionNotification from './queues/mention-notification';
import processDirectMessageNotification from './queues/direct-message-notification';
import processReactionNotification from './queues/reaction-notification';
import processThreadReactionNotification from './queues/thread-reaction-notification';
import processChannelNotification from './queues/channel-notification';
import processCommunityNotification from './queues/community-notification';
import processThreadNotification from './queues/thread-notification';
import processCommunityInvite from './queues/community-invite';
import trackUserThreadLastSeen from './queues/track-user-thread-last-seen';
import processAdminMessageModeration from './queues/moderationEvents/message';
import processAdminThreadModeration from './queues/moderationEvents/thread';
import processUserRequestedJoinPrivateChannel from './queues/private-channel-request-sent';
import processUserRequestPrivateChannelApproved from './queues/private-channel-request-approved';
import processUserRequestedJoinPrivateCommunity from './queues/private-community-request-sent';
import processUserRequestPrivateCommunityApproved from './queues/private-community-request-approved';
import processPushNotifications from './queues/send-push-notifications';
import startNotificationsListener from './listeners/notifications';
import processSendSlackInvitations from './queues/send-slack-invitations';
import {
  MESSAGE_NOTIFICATION,
  MENTION_NOTIFICATION,
  DIRECT_MESSAGE_NOTIFICATION,
  REACTION_NOTIFICATION,
  THREAD_REACTION_NOTIFICATION,
  CHANNEL_NOTIFICATION,
  COMMUNITY_NOTIFICATION,
  THREAD_NOTIFICATION,
  COMMUNITY_INVITE_NOTIFICATION,
  PROCESS_ADMIN_TOXIC_MESSAGE,
  PROCESS_ADMIN_TOXIC_THREAD,
  PRIVATE_CHANNEL_REQUEST_SENT,
  PRIVATE_CHANNEL_REQUEST_APPROVED,
  PRIVATE_COMMUNITY_REQUEST_SENT,
  PRIVATE_COMMUNITY_REQUEST_APPROVED,
  SEND_PUSH_NOTIFICATIONS,
  TRACK_USER_LAST_SEEN,
  SEND_SLACK_INVITIATIONS,
} from './queues/constants';

const PORT = process.env.PORT || 3003;

debug('\n🛠 Athena, the processing worker, is starting...');
debug('Logging with debug enabled!');
debug('');

const server = createWorker({
  [MESSAGE_NOTIFICATION]: processMessageNotification,
  [MENTION_NOTIFICATION]: processMentionNotification,
  [DIRECT_MESSAGE_NOTIFICATION]: processDirectMessageNotification,
  [REACTION_NOTIFICATION]: processReactionNotification,
  [THREAD_REACTION_NOTIFICATION]: processThreadReactionNotification,
  [CHANNEL_NOTIFICATION]: processChannelNotification,
  [COMMUNITY_NOTIFICATION]: processCommunityNotification,
  [THREAD_NOTIFICATION]: processThreadNotification,
  [SEND_SLACK_INVITIATIONS]: processSendSlackInvitations,
  [COMMUNITY_INVITE_NOTIFICATION]: processCommunityInvite,
  [TRACK_USER_LAST_SEEN]: trackUserThreadLastSeen,
  [PROCESS_ADMIN_TOXIC_MESSAGE]: processAdminMessageModeration,
  [PROCESS_ADMIN_TOXIC_THREAD]: processAdminThreadModeration,
  [PRIVATE_CHANNEL_REQUEST_SENT]: processUserRequestedJoinPrivateChannel,
  [PRIVATE_CHANNEL_REQUEST_APPROVED]: processUserRequestPrivateChannelApproved,
  [PRIVATE_COMMUNITY_REQUEST_SENT]: processUserRequestedJoinPrivateCommunity,
  [PRIVATE_COMMUNITY_REQUEST_APPROVED]: processUserRequestPrivateCommunityApproved,
  [SEND_PUSH_NOTIFICATIONS]: processPushNotifications,
});

startNotificationsListener();

debug(
  `🗄 Queues open for business ${(process.env.NODE_ENV === 'production' &&
    // $FlowIssue
    `at ${process.env.COMPOSE_REDIS_URL}:${process.env.COMPOSE_REDIS_PORT}`) ||
    'locally'}`
);

// $FlowIssue
server.listen(PORT, 'localhost', () => {
  debug(
    `💉 Healthcheck server running at ${server.address().address}:${
      server.address().port
    }`
  );
});
