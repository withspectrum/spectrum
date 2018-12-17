// @flow
const debug = require('debug')('athena:queue:community-invitation');
import Raven from '../../shared/raven';
import { fetchPayload } from '../utils/payloads';
import { getUserPermissionsInCommunity } from '../models/usersCommunities';
import { storeNotification } from '../models/notification';
import { getUserByEmail } from 'shared/db/queries/user';
import createQueue from '../../shared/bull/create-queue';
import { storeUsersNotifications } from 'shared/db/queries/usersNotifications';
import { getCommunitySettings } from '../models/communitySettings';
import { SEND_COMMUNITY_INVITE_EMAIL } from './constants';
const sendCommunityInviteEmailQueue = createQueue(SEND_COMMUNITY_INVITE_EMAIL);
import type {
  CommunityInviteNotificationJobData,
  Job,
} from 'shared/bull/types';
import { signCommunity, signUser } from 'shared/imgix';

const addToSendCommunityInviteEmailQueue = (
  recipient,
  community,
  communitySettings,
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
      sender: signUser(sender),
      community: signCommunity(community),
      communitySettings,
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

export default async (job: Job<CommunityInviteNotificationJobData>) => {
  const {
    recipient: inboundRecipient,
    communityId,
    senderId,
    customMessage,
  } = job.data;

  /*
		These promises are used to create or modify a notification. The order is:
		- existingUser
		- actor
		- context
		In this case the context and entity are the same
  */

  const existingUser = await getUserByEmail(inboundRecipient.email);
  const actor = await fetchPayload('USER', senderId);
  const context = await fetchPayload('COMMUNITY', communityId);

  const communityToInvite = JSON.parse(context.payload);
  const communitySettings = await getCommunitySettings(communityId);
  const sender = JSON.parse(actor.payload);

  // if the recipient of the email is not a member of spectrum, pass their information along to the email queue
  if (!existingUser) {
    debug('recipient does not exist on spectrum, sending an email');
    return addToSendCommunityInviteEmailQueue(
      inboundRecipient,
      communityToInvite,
      communitySettings,
      sender,
      customMessage
    ).catch(err => {
      console.error(err);
      Raven.captureException(err);
    });
  } else {
    // the user exists on spectrum
    // check to see if they have any role in this community already
    const permissions = await getUserPermissionsInCommunity(
      communityId,
      existingUser.id
    );
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
      {
        actors: [actor],
        event: 'COMMUNITY_INVITE',
        context,
        entities: [context], // entity and context are the same for this type of notification
      }
    );
    debug('creating new notification');

    const updatedNotification = await storeNotification(newNotification);
    const sendInvite = await addToSendCommunityInviteEmailQueue(
      {
        ...inboundRecipient,
        userId: existingUser.id,
      },
      communityToInvite,
      communitySettings,
      sender,
      customMessage
    );
    const usersNotification = await storeUsersNotifications(
      updatedNotification.id,
      existingUser.id
    );
    debug('store new usersnotifications records');
    return Promise.all([
      updatedNotification,
      sendInvite,
      usersNotification,
    ]).catch(err => {
      console.error('❌ Error in job:\n');
      console.error(err);
      Raven.captureException(err);
    });
  }
};
