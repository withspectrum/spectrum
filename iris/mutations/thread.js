// @flow
// $FlowFixMe
import UserError from '../utils/UserError';
import { getChannels } from '../models/channel';
import { getCommunities } from '../models/community';
import { getUserPermissionsInChannel } from '../models/usersChannels';
import { getUserPermissionsInCommunity } from '../models/usersCommunities';
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

module.exports = {
  Mutation: {
    publishThread: (_, { thread }, { user }) => {
      const currentUser = user;

      // user must be authed to publish a thread
      if (!currentUser) {
        return new UserError('You must be signed in to publish a new thread.');
      }

      // get the current user's permissions in the channel where the thread is being posted
      const currentUserChannelPermissions = getUserPermissionsInChannel(
        thread.channelId,
        currentUser.id
      );

      // get the channel object where the thread is being posted
      const channels = getChannels([thread.channelId]);

      return Promise.all([currentUserChannelPermissions, channels])
        .then(([currentUserChannelPermissions, channels]) => {
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

          /*
            If the thread has attachments, we have to iterate through each attachment and JSON.parse() the data payload. This is because we want a generic data shape in the graphQL layer like this:

            {
              attachmentType: enum String
              data: String
            }

            But when we get the data onto the client we JSON.parse the `data` field so that we can have any generic shape for attachments in the future.
          */
          let attachments = [];
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
            const newThread = Object.assign({}, thread, {
              attachments,
            });

            // publish the thread
            return publishThread(newThread, currentUser.id);
          } else {
            // if there are no attachments, publish the thread
            return publishThread(thread, currentUser.id);
          }
        })
        .then(newThread => {
          // create a relationship between the thread and the author. this can happen in the background so we can also immediately pass the thread down the promise chain
          createParticipantInThread(newThread.id, currentUser.id);
          return newThread;
        })
        .then(newThread => {
          // if the original mutation input contained files to upload
          if (thread.filesToUpload) {
            return Promise.all([
              newThread,
              Promise.all(
                // upload each of the files to s3
                thread.filesToUpload.map(file =>
                  uploadImage(file, 'threads', newThread.id)
                )
              ),
            ]);
          } else {
            return Promise.all([newThread]);
          }
        })
        .then(([newThread, urls]) => {
          // if no files were uploaded, return the new thread object
          return newThread;

          // TODO: MAYBE FIXME MOTHERFUCKER
          // otherwise we need to update the slate object of the thread to replace the image nodes with markdown image text
          const slateState = JSON.parse(newThread.content.body);
          let fileIndex = 0;
          const newSlateState = {
            ...slateState,
            nodes: slateState.nodes.map(node => {
              if (node.type !== 'image') return node;
              fileIndex++;
              return {
                kind: 'block',
                type: 'paragraph',
                nodes: [
                  {
                    kind: 'text',
                    text: `![](${urls[fileIndex - 1]})`,
                  },
                ],
              };
            }),
          };

          return updateThreadWithImages(
            newThread.id,
            JSON.stringify(newSlateState)
          );
        });
    },
    editThread: (_, { input }, { user }) => {
      const currentUser = user;

      // user must be authed to edit a thread
      if (!currentUser) {
        return new UserError(
          'You must be signed in to make changes to this thread.'
        );
      }

      return getThreads([input.threadId])
        .then(threads => {
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

            const newInput = Object.assign({}, input, {
              attachments,
            });

            return editThread(newInput);
          } else {
            // if no attachments were passed into the thread, we can just publish
            // as-is
            return editThread(input);
          }
        })
        .then(editedThread => {
          if (!input.filesToUpload) return Promise.all([editedThread]);

          // if the edited thread has new files to upload
          return Promise.all([
            editedThread,
            Promise.all(
              input.filesToUpload.map(file =>
                uploadImage(file, 'threads', editedThread.id)
              )
            ),
          ]);
        })
        .then(([editedThread, urls]) => {
          if (!urls) return editedThread;

          // update the slate body with markdown images instead of image nodes
          const slateState = JSON.parse(editedThread.content.body);
          let fileIndex = 0;
          const newSlateState = {
            ...slateState,
            nodes: slateState.nodes.map(node => {
              if (node.type !== 'image') return node;
              fileIndex++;
              return {
                kind: 'block',
                type: 'paragraph',
                nodes: [
                  {
                    kind: 'text',
                    text: `![](${urls[fileIndex - 1]})`,
                  },
                ],
              };
            }),
          };

          return updateThreadWithImages(
            editedThread.id,
            JSON.stringify(newSlateState)
          );
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
