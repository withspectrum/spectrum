// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import { uploadImage } from '../../utils/s3';
import { getUserPermissionsInChannel } from '../../models/usersChannels';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { getCommunityRecurringPayments } from '../../models/recurringPayment';
import { getChannels } from '../../models/channel';
import { publishThread, editThread } from '../../models/thread';
import { createParticipantInThread } from '../../models/usersThreads';
import type { FileUpload } from 'shared/types';

type Attachment = {
  attachmentType: string,
  data: string,
};

type File = FileUpload;

type PublishThreadInput = {
  thread: {
    channelId: string,
    communityId: string,
    type: 'SLATE' | 'DRAFTJS',
    content: {
      title: string,
      body?: string,
    },
    attachments?: ?Array<Attachment>,
    filesToUpload?: ?Array<File>,
  },
};

export default async (
  _: any,
  { thread }: PublishThreadInput,
  { user }: GraphQLContext
) => {
  const currentUser = user;

  // user must be authed to publish a thread
  if (!currentUser) {
    return new UserError('You must be signed in to publish a new thread.');
  }

  if (thread.type === 'SLATE') {
    throw new UserError(
      "You're on an old version of Spectrum, please refresh your browser."
    );
  }

  // get the current user's permissions in the channel where the thread is being posted
  const getCurrentUserChannelPermissions = getUserPermissionsInChannel(
    thread.channelId,
    currentUser.id
  );

  const getCurrentUserCommunityPermissions = getUserPermissionsInCommunity(
    thread.communityId,
    currentUser.id
  );

  const getParentCommunityIsPro = getCommunityRecurringPayments(
    thread.communityId
  ).then(subs => {
    let filtered = subs && subs.filter(sub => sub.status === 'active');
    return !filtered || filtered.length === 0 ? false : true;
  });

  const [
    currentUserChannelPermissions,
    currentUserCommunityPermissions,
    parentCommunityIsPro,
    channels,
  ] = await Promise.all([
    getCurrentUserChannelPermissions,
    getCurrentUserCommunityPermissions,
    getParentCommunityIsPro,
    getChannels([thread.channelId]),
  ]);

  // select the channel to evaluate
  const channelToEvaluate = channels[0];

  // if channel wasn't found or is deleted
  if (!channelToEvaluate || channelToEvaluate.deletedAt) {
    return new UserError("This channel doesn't exist");
  }

  // if user isn't a channel member
  if (
    !currentUserChannelPermissions.isMember ||
    currentUserChannelPermissions.isBlocked ||
    currentUserCommunityPermissions.isBlocked
  ) {
    return new UserError(
      "You don't have permission to create threads in this channel."
    );
  }

  if (!parentCommunityIsPro && channelToEvaluate.isPrivate) {
    return new UserError(
      'Communities must be on the Pro plan to publish new threads in private channels'
    );
  }

  /*
  If the thread has attachments, we have to iterate through each attachment and JSON.parse() the data payload. This is because we want a generic data shape in the graphQL layer like this:

  {
    attachmentType: enum String
    data: String
  }

  But when we get the data onto the client we JSON.parse the `data` field so that we can have any generic shape for attachments in the future.
*/
  let attachments = [];
  let threadObject = Object.assign(
    {},
    {
      ...thread,
      content: {
        ...thread.content,
        title: thread.content.title.trim(),
      },
    }
  );
  // if the thread has attachments
  if (thread.attachments) {
    // iterate through them and construct a new attachment object
    thread.attachments.map(attachment => {
      attachments.push({
        attachmentType: attachment.attachmentType,
        data: JSON.parse(attachment.data),
      });
    });

    // create a new thread object, overriding the attachments field with our new array
    threadObject = Object.assign({}, threadObject, {
      attachments,
    });
  }

  // $FlowIssue
  const dbThread = await publishThread(threadObject, currentUser.id);

  // create a relationship between the thread and the author. this can happen in the background so we can also immediately pass the thread down the promise chain
  await createParticipantInThread(dbThread.id, currentUser.id);

  if (!thread.filesToUpload || thread.filesToUpload.length === 0)
    return dbThread;

  // if the original mutation input contained files to upload
  const urls = await Promise.all(
    // upload each of the files to s3
    thread.filesToUpload.map(
      file => file && uploadImage(file, 'threads', dbThread.id)
    )
  );

  // Replace the local image srcs with the remote image src
  const body = dbThread.content.body && JSON.parse(dbThread.content.body);
  const imageKeys = Object.keys(body.entityMap).filter(
    key => body.entityMap[key].type === 'image'
  );
  urls.forEach((url, index) => {
    if (!body.entityMap[imageKeys[index]]) return;
    body.entityMap[imageKeys[index]].data.src = url;
  });

  // Update the thread with the new links
  return editThread(
    {
      threadId: dbThread.id,
      content: {
        ...dbThread.content,
        body: JSON.stringify(body),
      },
    },
    false
  );
};
