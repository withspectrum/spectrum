// @flow
import { addTagsToThread } from '../../models/thread';
import UserError from '../../utils/UserError';
import {
  isAuthedResolver,
  canAdministerCommunity,
} from '../../utils/permissions';

type AddTagsToThreadArgs = {
  input: {
    threadId: string,
    tagIds: [string],
  },
};

export default isAuthedResolver(
  async (_: void, { input }: AddTagsToThreadArgs, { user, loaders }) => {
    const thread = await loaders.thread.load(input.threadId);
    if (!thread || !thread.communityId || thread.deletedAt)
      return new UserError(`Thread "${input.threadId}" does not exist.`);
    if (!(await canAdministerCommunity(thread.communityId, user.id, loaders)))
      return new UserError('Only team members can add tags to a thread.');

    const tags = await loaders.threadTags.loadMany(input.tagIds);

    if (tags.some(tag => !tag || tag.communityId !== thread.communityId))
      return new UserError('Passed invalid tag IDs.');

    return addTagsToThread(input.threadId, input.tagIds);
  }
);
