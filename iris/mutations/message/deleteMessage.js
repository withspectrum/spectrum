// @flow

export default async (
  _: any,
  { id }: DeleteMessageInput,
  { user }: GraphQLContext
) => {
  debug(`delete message#${id}`);
  const currentUser = user;
  if (!currentUser)
    throw new UserError('You must be signed in to delete a message.');

  const message = await getMessage(id);
  if (!message) throw new UserError('This message does not exist.');

  if (message.senderId !== currentUser.id) {
    // Only the sender can delete a directMessageThread message
    if (message.threadType === 'directMessageThread') {
      throw new UserError('You can only delete your own messages.');
    }

    const thread = await getThread(message.threadId);
    const communityPermissions = await getUserPermissionsInCommunity(
      thread.communityId,
      currentUser.id
    );
    const channelPermissions = await getUserPermissionsInChannel(
      thread.channelId,
      currentUser.id
    );
    const canModerate =
      channelPermissions.isOwner ||
      communityPermissions.isOwner ||
      channelPermissions.isModerator ||
      communityPermissions.isModerator;
    if (!canModerate)
      throw new UserError("You don't have permission to delete this message.");
  }

  // Delete message and remove participant from thread if it's the only message from that person
  debug(`permission checks pass, actually delete message#${id}`);
  return deleteMessage(currentUser.id, id).then(() => {
    // We don't need to delete participants of direct message threads
    if (message.threadType === 'directMessageThread') return true;

    debug('thread message, check if user has more messages in thread');
    return userHasMessagesInThread(
      message.threadId,
      message.senderId
    ).then(hasMoreMessages => {
      if (hasMoreMessages) return true;
      debug('user has no more messages, delete userThread record');
      return deleteParticipantInThread(message.threadId, message.senderId).then(
        () => true
      );
    });
  });
};
