// @flow

export const canViewDMThread = async (
  threadId: string,
  userId: string,
  { loaders }: { loaders: Object }
) => {
  if (!userId) return false;

  const result = await loaders.directMessageParticipants.load(threadId);
  if (!result || !result.reduction || result.reduction.length === 0)
    return false;

  const members = result.reduction;
  const ids = members.map(({ userId }) => userId);
  if (ids.indexOf(userId) === -1) return false;

  return true;
};
