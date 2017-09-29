const debug = require('debug')('athena:queue:community-invitation');
import { fetchPayload, createPayload } from '../utils/payloads';
import { getDistinctActors } from '../utils/actors';
import { getCommunityById } from '../models/community';
import { getUserPermissionsInCommunity } from '../models/usersCommunities';
import { storeNotification } from '../models/notification';
import { getUserByEmail } from '../models/user';
import createQueue from '../../shared/bull/create-queue';
import {
  storeUsersNotifications,
  markUsersNotificationsAsNew,
} from '../models/usersNotifications';
import { SEND_COMMUNITY_INVITE_EMAIL } from './constants';
const sendCommunityInviteEmailQueue = createQueue(SEND_COMMUNITY_INVITE_EMAIL);

const addToSendCommunityInviteEmailQueue = (
  recipient,
  community,
  sender,
  customMessage
) => {
  if (!recipient || !recipient.email || !community || !sender) {
    debug('aborting adding to email queue due to invalid data');
    return Promise.resolve();
  }

  return sendCommunityInviteEmailQueue.add(
    {
      to: recipient.email,
      recipient,
      sender,
      community,
      customMessage,
    },
    {
      removeOnComplete: true,
      removeOnFail: true,
    }
  );
};

/*
  LOOSE OUTLINE:

  1. See if a user with that email already exists
      1a. If user exists, see if user is a member of the community
        1aa. If they are already a member of the community, skip
        1ab. If they are not a member of the community, proceed to 2
      1b. If the user does not exist, proceed to 3
  2. For users who are already on Specrum and are not in the community, generate a new
      notification with the invitation. We don't worry at all about bundling for this
      type of notification since they will rarely overlap, and are high enough signal
      that showing multiple community invitation notifications is fine.
      For each of these users, proceed to 3
  3. For users who are both on Spectrum but not a member of the community, and users who
      are not on Spectrum, send an email invitation
      3a. generate a communityInvitation record in the db
      3b. send an email
*/

const processMessageNotificationQueue = job => {
  const { recipient, communityId, senderId, customMessage } = job.data;

  const inboundRecipient = recipient;

  /*
    These promises are used to create or modify a notification. The order is:
    - actor
    - context
    - entity
    In this case the context and entity are the same
  */
  const getPayloads = [
    // see if the user being invited is already a member of spectrum
    getUserByEmail(inboundRecipient.email),
    //get the user who sent the invitation
    fetchPayload('USER', senderId),
    // get the community that the user is being invited to - this will be reused for the notification entity
    fetchPayload('COMMUNITY', communityId),
  ];

  return Promise.all(getPayloads)
    .then(([existingUser, actor, context]) => {
      const communityToInvite = JSON.parse(context.payload);
      const sender = JSON.parse(actor.payload);

      // if the recipient of the email is not a member of spectrum, pass their information along to the email queue
      if (!existingUser) {
        debug(`recipient does not exist on spectrum, sending an email`);
        return addToSendCommunityInviteEmailQueue(
          inboundRecipient,
          communityToInvite,
          sender,
          customMessage
        );
      } else {
        return getUserPermissionsInCommunity(
          communityId,
          existingUser.id
        ).then(permissions => {
          // if user is blocked, is already a member, owns the community, don't send a notification
          if (
            permissions.isBlocked ||
            permissions.isModerator ||
            permissions.isOwner ||
            permissions.isMember
          )
            return;

          // Create notification if user is not a member
          const newNotification = Object.assign(
            {},
            {},
            {
              actors: [actor],
              event: 'COMMUNITY_INVITE',
              context,
              entities: [context], // entity and context are the same for this type of notification
            }
          );

          debug('creating new notification');

          return storeNotification(newNotification).then(notification => {
            debug('store new usersnotifications records');

            return Promise.all([
              addToSendCommunityInviteEmailQueue(
                inboundRecipient,
                communityToInvite,
                sender,
                customMessage
              ),
              storeUsersNotifications(notification.id, existingUser.id),
            ]);
          });
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
};

export default processMessageNotificationQueue;
