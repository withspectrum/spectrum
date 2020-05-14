// @flow
const debug = require('debug')('api:mutations:edit-thread');
import type { GraphQLContext } from '../../';
import type { EditThreadInput } from '../../models/thread';
import UserError from '../../utils/UserError';
import { uploadImage } from '../../utils/file-storage';
import { getThreads, editThread } from '../../models/thread';
import { getUserPermissionsInCommunity } from '../../models/usersCommunities';
import { getUserPermissionsInChannel } from '../../models/usersChannels';
import { isAuthedResolver as requireAuth } from '../../utils/permissions';
import processThreadContent from 'shared/draft-utils/process-thread-content';
import { hasLegacyPrefix, stripLegacyPrefix } from 'shared/imgix';

type Input = {
  input: EditThreadInput,
};

export default requireAuth(async (_: any, args: Input, ctx: GraphQLContext) => {
  const { input } = args;
  const { user } = ctx;

  if (input.type === 'SLATE') {
    return new UserError(
      "You're on an old version of Spectrum, please refresh your browser."
    );
  }

  const threads = await getThreads([input.threadId]);

  // select the thread
  const threadToEvaluate = threads[0];

  // if the thread doesn't exist
  if (!threads || !threadToEvaluate) {
    return new UserError("This thread doesn't exist");
  }

  const [communityPermissions, channelPermissions] = await Promise.all([
    getUserPermissionsInCommunity(threadToEvaluate.communityId, user.id),
    getUserPermissionsInChannel(threadToEvaluate.channelId, user.id),
  ]);

  const canEdit =
    !channelPermissions.isBlocked &&
    !communityPermissions.isBlocked &&
    (threadToEvaluate.creatorId === user.id ||
      communityPermissions.isModerator ||
      communityPermissions.isOwner);
  // only the thread creator can edit the thread
  // also prevent deletion if the user was blocked
  if (!canEdit) {
    return new UserError(
      "You don't have permission to make changes to this thread."
    );
  }

  input.content.body = processThreadContent('TEXT', input.content.body || '');

  /*
    When threads are sent to the client, all image urls are signed and proxied
    via imgix. If a user edits the thread, we have to restore all image upload
    urls back to their previous state so that we don't accidentally store
    an encoded, signed, and expired image url back into the db
  */
  const initialBody = input.content.body && JSON.parse(input.content.body);

  if (initialBody) {
    const imageKeys = Object.keys(initialBody.entityMap).filter(
      key => initialBody.entityMap[key].type.toLowerCase() === 'image'
    );

    const stripQueryParams = (str: string): string => {
      if (
        str.indexOf('https://spectrum.imgix.net') < 0 &&
        str.indexOf('https://spectrum-proxy.imgix.net') < 0
      ) {
        return str;
      }

      const split = str.split('?');
      // if no query params existed, we can just return the original image
      if (split.length < 2) return str;

      // otherwise the image path is everything before the first ? in the url
      const imagePath = split[0];
      // images are encoded during the signing process (shared/imgix/index.js)
      // so they must be decoded here for accurate storage in the db
      const decoded = decodeURIComponent(imagePath);
      // we remove https://spectrum.imgix.net from the path as well so that the
      // path represents the generic location of the file in s3 and decouples
      // usage with imgix
      const processed = hasLegacyPrefix(decoded)
        ? stripLegacyPrefix(decoded)
        : decoded;
      return processed;
    };

    imageKeys.forEach((key, index) => {
      if (!initialBody.entityMap[key[index]]) return;

      const { src } = initialBody.entityMap[imageKeys[index]].data;
      initialBody.entityMap[imageKeys[index]].data.src = stripQueryParams(src);
    });
  }

  debug('store new body to database:', initialBody);
  const newInput = Object.assign({}, input, {
    ...input,
    content: {
      body: JSON.stringify(initialBody),
      title: input.content.title.trim(),
    },
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
    return new UserError(err.message);
  }

  if (!urls || urls.length === 0) return editedThread;

  // Replace the local image srcs with the remote image src
  const body =
    editedThread.content.body && JSON.parse(editedThread.content.body);

  const imageKeys = Object.keys(body.entityMap).filter(
    key =>
      body.entityMap[key].type.toLowerCase() === 'image' &&
      body.entityMap[key].data.src.startsWith('blob:')
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
