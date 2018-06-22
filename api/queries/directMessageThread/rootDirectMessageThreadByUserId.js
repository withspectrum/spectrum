// @flow
import type { GraphQLContext } from '../../';
import { checkForExistingDMThread } from '../../models/directMessageThread';

type Args = {
  userId: string,
};

export default async (_: any, args: Args, ctx: GraphQLContext) => {
  // signed out users will never be able to view a dm thread
  const { user: currentUser, loaders } = ctx;
  const { userId } = args;

  if (!currentUser || !currentUser.id) return null;

  const allMemberIds = [userId, currentUser.id];
  const existingThread = await checkForExistingDMThread(allMemberIds);

  if (!existingThread) return null;

  return loaders.directMessageThread.load(existingThread);
};
