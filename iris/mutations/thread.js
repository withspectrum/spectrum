// $FlowFixMe
import UserError from '../utils/UserError';
import { getChannels } from '../models/channel';
import { getCommunities } from '../models/community';
import { getUserPermissionsInChannel } from '../models/usersChannels';
import { getUserPermissionsInCommunity } from '../models/usersCommunities';
import { getCommunityRecurringPayments } from '../models/recurringPayment';
import {
  createParticipantInThread,
  createNotifiedUserInThread,
  getThreadNotificationStatusForUser,
  updateThreadNotificationStatusForUser,
} from '../models/usersThreads';
const {
  getThread,
  getThreads,
  publishThread,
  deleteThread,
  setThreadLock,
  editThread,
  updateThreadWithImages,
} = require('../models/thread');
const { uploadImage } = require('../utils/s3');
import { addQueue } from '../utils/workerQueue';
import { toState, toPlainText } from 'shared/draft-utils';

module.exports = {
  Mutation: {
    publishThread: async (_, { thread }, { user }) => {
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

      const getParentCommunityIsPro = getCommunityRecurringPayments(
        thread.communityId
      ).then(subs => {
        let filtered = subs && subs.filter(sub => sub.status === 'active');
        return !filtered || filtered.length === 0 ? false : true;
      });

      const [
        currentUserChannelPermissions,
        parentCommunityIsPro,
        channels,
      ] = await Promise.all([
        getCurrentUserChannelPermissions,
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
      if (!currentUserChannelPermissions.isMember) {
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

      const dbThread = await publishThread(threadObject, currentUser.id);

      // create a relationship between the thread and the author. this can happen in the background so we can also immediately pass the thread down the promise chain
      await createParticipantInThread(dbThread.id, currentUser.id);

      if (!thread.filesToUpload || thread.filesToUpload.length === 0)
        return dbThread;

      // if the original mutation input contained files to upload
      const urls = await Promise.all(
        // upload each of the files to s3
        thread.filesToUpload.map(file =>
          uploadImage(file, 'threads', dbThread.id)
        )
      );

      // Replace the local image srcs with the remote image src
      const body = JSON.parse(dbThread.content.body);
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
    },
    editThread: async (_, { input }, { user }) => {
      const currentUser = user;

      // user must be authed to edit a thread
      if (!currentUser) {
        return new UserError(
          'You must be signed in to make changes to this thread.'
        );
      }

      if (input.type === 'SLATE') {
        throw new UserError(
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

      // only the thread creator can edit the thread
      if (threadToEvaluate.creatorId !== currentUser.id) {
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

      const editedThread = await editThread(newInput);

      if (!input.filesToUpload) return editedThread;

      const urls = await Promise.all(
        input.filesToUpload.map(file =>
          uploadImage(file, 'threads', editedThread.id)
        )
      );

      if (!urls || urls.length === 0) return editedThread;

      // Replace the local image srcs with the remote image src
      const body = JSON.parse(editedThread.content.body);
      const imageKeys = Object.keys(body.entityMap).filter(
        key => body.entityMap[key].type === 'image'
      );
      urls.forEach((url, index) => {
        if (!body.entityMap[imageKeys[index]]) return;
        body.entityMap[imageKeys[index]].data.src = url;
      });

      // Update the thread with the new links
      return editThread({
        threadId: editedThread.id,
        content: {
          ...editedThread.content,
          body: JSON.stringify(body),
        },
      });
    },
    deleteThread: (_, { threadId }, { user }) => {
      const currentUser = user;

      // user must be authed to edit a thread
      if (!currentUser) {
        return new UserError(
          'You must be signed in to make changes to this thread.'
        );
      }

      // get the thread being locked
      return getThreads([threadId])
        .then(threads => {
          // select the thread
          const threadToEvaluate = threads[0];

          // if the thread doesn't exist
          if (!threadToEvaluate || threadToEvaluate.deletedAt) {
            return new UserError("This thread doesn't exist");
          }

          // get the channel permissions
          const currentUserChannelPermissions = getUserPermissionsInChannel(
            threadToEvaluate.channelId,
            currentUser.id
          );
          // get the community permissions (community owners and mods can delete a thread anywhere in the community)
          const currentUserCommunityPermissions = getUserPermissionsInCommunity(
            threadToEvaluate.communityId,
            currentUser.id
          );

          // return the thread, channels and communities
          return Promise.all([
            threadToEvaluate,
            currentUserChannelPermissions,
            currentUserCommunityPermissions,
          ]);
        })
        .then(
          (
            [
              thread,
              currentUserChannelPermissions,
              currentUserCommunityPermissions,
            ]
          ) => {
            // if the user owns the community or the channel, or they are the original creator, they can delete the thread
            if (
              currentUserChannelPermissions.isOwner ||
              currentUserChannelPermissions.isModerator ||
              currentUserCommunityPermissions.isOwner ||
              currentUserCommunityPermissions.isModerator ||
              thread.creatorId === currentUser.id
            ) {
              // if the current user doing the deleting does not match the thread creator, we can assume that this deletion is happening as a moderation event. In this case we grant reputation to the moderator
              if (currentUser.id !== thread.creatorId) {
                addQueue('process reputation event', {
                  userId: currentUser.id,
                  type: 'thread deleted by moderation',
                  entityId: thread.communityId,
                });
              }

              return deleteThread(threadId);
            }

            // if the user is not a channel or community owner, the thread can't be locked
            return new UserError(
              "You don't have permission to make changes to this thread."
            );
          }
        );
    },
    setThreadLock: (_, { threadId, value }, { user }) => {
      const currentUser = user;

      // user must be authed to edit a thread
      if (!currentUser) {
        return new UserError(
          'You must be signed in to make changes to this thread.'
        );
      }

      // get the thread being locked
      return getThreads([threadId])
        .then(threads => {
          // select the thread
          const threadToEvaluate = threads[0];

          // if the thread doesn't exist
          if (!threadToEvaluate || threadToEvaluate.deletedAt) {
            return new UserError("This thread doesn't exist");
          }

          // get the channel permissions
          const currentUserChannelPermissions = getUserPermissionsInChannel(
            threadToEvaluate.channelId,
            currentUser.id
          );
          // get the community permissions
          const currentUserCommunityPermissions = getUserPermissionsInCommunity(
            threadToEvaluate.communityId,
            currentUser.id
          );

          // return the thread, channels and communities
          return Promise.all([
            threadToEvaluate,
            currentUserChannelPermissions,
            currentUserCommunityPermissions,
          ]);
        })
        .then(
          (
            [
              thread,
              currentUserChannelPermissions,
              currentUserCommunityPermissions,
            ]
          ) => {
            // user owns the community or the channel, they can lock the thread
            if (
              currentUserChannelPermissions.isOwner ||
              currentUserChannelPermissions.isModerator ||
              currentUserCommunityPermissions.isOwner ||
              currentUserCommunityPermissions.isModerator
            ) {
              return setThreadLock(threadId, value);
            }

            // if the user is not a channel or community owner, the thread can't be locked
            return new UserError(
              "You don't have permission to make changes to this thread."
            );
          }
        );
    },
    toggleThreadNotifications: (_, { threadId }, { user }) => {
      const currentUser = user;

      // user must be authed to edit a thread
      if (!currentUser) {
        return new UserError(
          'You must be signed in to get notifications for this thread.'
        );
      }

      // check to see if a relationship between this user and this thread exists
      return getThreadNotificationStatusForUser(threadId, currentUser.id)
        .then(threads => {
          if (threads && threads.length > 0) {
            const threadToEvaluate = threads[0];
            // a relationship with this thread exists, we are going to update it
            let value;
            if (threadToEvaluate.receiveNotifications) {
              // if they are currently receiving notifications, turn them off
              value = false;
              return updateThreadNotificationStatusForUser(
                threadId,
                currentUser.id,
                value
              );
            } else {
              // if they aren't receiving notifications, turn them on
              value = true;
              return updateThreadNotificationStatusForUser(
                threadId,
                currentUser.id,
                value
              );
            }
          } else {
            // if a relationship doesn't exist, create a new one
            return createNotifiedUserInThread(threadId, currentUser.id);
          }
        })
        .then(() => getThread(threadId));
    },
  },
};
