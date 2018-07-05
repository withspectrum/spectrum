// @flow
import type { GraphQLContext } from '../../';
import type { EditThreadInput } from '../../models/thread';
import UserError from '../../utils/UserError';
import { uploadImage } from '../../utils/file-storage';
import { getThreads, editThread } from '../../models/thread';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { getUserPermissionsInChannel } from '../../models/usersChannels';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import { events } from 'shared/analytics';
import { trackQueue } from 'shared/bull/queues';

type Input = {
  input: EditThreadInput,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { input } = args;
  const { user } = ctx;

  if (input.type === 'SLATE') {
    trackQueue.add({
      userId: user.id,
      event: events.THREAD_EDITED_FAILED,
      context: { threadId: input.threadId },
      properties: {
        reason: 'slate type',
      },
    });

    return new UserError(
      "You're on an old version of Spectrum, please refresh your browser."
    );
  }

  const threads = await getThreads([input.threadId]);

  // select the thread
  const threadToEvaluate = threads[0];

  // if the thread doesn't exist
  if (!threads || !threadToEvaluate) {
    trackQueue.add({
      userId: user.id,
      event: events.THREAD_EDITED_FAILED,
      context: { threadId: input.threadId },
      properties: {
        reason: 'thread does not exist',
      },
    });

    return new UserError("This thread doesn't exist");
  }

  const [communityPermissions, channelPermissions] = await Promise.all([
    getUserPermissionsInCommunity(threadToEvaluate.communityId, user.id),
    getUserPermissionsInChannel(threadToEvaluate.channelId, user.id),
  ]);

  // only the thread creator can edit the thread
  // also prevent deletion if the user was blocked
  if (
    threadToEvaluate.creatorId !== user.id ||
    channelPermissions.isBlocked ||
    communityPermissions.isBlocked
  ) {
    trackQueue.add({
      userId: user.id,
      event: events.THREAD_EDITED_FAILED,
      context: { threadId: input.threadId },
      properties: {
        reason: 'no permission',
      },
    });

    return new UserError(
      "You don't have permission to make changes to this thread."
    );
  }

  let attachments = [];
  // if the thread came in with attachments
  if (input.attachments) {
    // iterate through them and construct a new attachment object
    input.attachments.map(attachment => {
      attachments.push({
        attachmentType: attachment.attachmentType,
        data: JSON.parse(attachment.data),
      });

      return null;
    });
  }

  const newInput = Object.assign({}, input, {
    ...input,
    content: {
      ...input.content,
      title: input.content.title.trim(),
    },
    attachments,
  });

  // $FlowIssue
  const editedThread = await editThread(newInput, user.id);

  if (!input.filesToUpload) return editedThread;

  let urls;
  try {
    urls = await Promise.all(
      input.filesToUpload.map(file =>
        uploadImage(file, 'threads', editedThread.id)
      )
    );
  } catch (err) {
    trackQueue.add({
      userId: user.id,
      event: events.THREAD_EDITED_FAILED,
      context: { threadId: input.threadId },
      properties: {
        reason: 'images failed to upload',
      },
    });

    return new UserError(err.message);
  }

  if (!urls || urls.length === 0) return editedThread;

  // Replace the local image srcs with the remote image src
  const body =
    editedThread.content.body && JSON.parse(editedThread.content.body);
  const imageKeys = Object.keys(body.entityMap).filter(
    key => body.entityMap[key].type.toLowerCase() === 'image'
  );
  urls.forEach((url, index) => {
    if (!body.entityMap[imageKeys[index]]) return;
    body.entityMap[imageKeys[index]].data.src = url;
  });

  // Update the thread with the new links
  return editThread(
    {
      threadId: editedThread.id,
      content: {
        ...editedThread.content,
        body: JSON.stringify(body),
      },
    },
    user.id
  );
});
