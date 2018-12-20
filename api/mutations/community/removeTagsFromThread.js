// @flow
import { removeTagsFromThread } from '../../models/thread';
import UserError from '../../utils/UserError';
import {
  isAuthedResolver,
  canModerateCommunity,
} from '../../utils/permissions';

type RemoveTagsFromThreadArgs = {
  input: {
    threadId: string,
    tagIds: [string],
  },
};

export default isAuthedResolver(
  async (_: void, { input }: RemoveTagsFromThreadArgs, { user, loaders }) => {
    const thread = await loaders.thread.load(input.threadId);

    if (!thread || !thread.communityId || thread.deletedAt)
      return new UserError(`Thread "${input.threadId}" does not exist.`);

    if (!(await canModerateCommunity(user.id, thread.communityId, loaders)))
      return new UserError('Only team members can remove tags to a thread.');

    const tags = await loaders.threadTags.loadMany(input.tagIds);

    if (tags.some(tag => !tag || tag.communityId !== thread.communityId))
      return new UserError('Passed invalid tag IDs.');

    return removeTagsFromThread(input.threadId, input.tagIds);
  }
);
