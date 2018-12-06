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
    tags: [string],
  },
};

export default isAuthedResolver(
  async (_: void, { input }: AddTagsToThreadArgs, { user, loaders }) => {
    const thread = await loaders.thread.load(input.threadId);
    if (!thread || !thread.communityId || thread.deletedAt)
      return new UserError(`Thread "${input.threadId}" does not exist.`);
    if (!(await canAdministerCommunity(thread.communityId, user.id, loaders)))
      return new UserError('Only team members can add tags to a thread.');

    // TODO(@mxstbr): Verify that tag IDs are valid and of the same community

    return addTagsToThread(input.threadId, input.tags);
  }
);
