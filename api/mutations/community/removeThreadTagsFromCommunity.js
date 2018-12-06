// @flow
import { deleteThreadTags } from '../../models/threadTags';
import {
  isAuthedResolver,
  canAdministerCommunity,
} from '../../utils/permissions';
import { getCommunityById } from '../../models/community';
import UserError from '../../utils/UserError';
import type { GraphQLContext } from '../../';

type RemoveThreadTagsFromCommunityInput = {
  input: {
    tagIds: Array<string>,
    communityId: string,
  },
};

export default isAuthedResolver(
  async (
    _: void,
    { input }: RemoveThreadTagsFromCommunityInput,
    { user, loaders }: GraphQLContext
  ) => {
    if (!(await canAdministerCommunity(input.communityId, user.id, loaders)))
      return new UserError(
        "You cannot delete thread tags if you're not a team member."
      );

    const tags = await loaders.threadTags.loadMany(input.tagIds);

    if (tags.some(tag => !tag || tag.communityId !== input.communityId))
      return new UserError('Passed invalid tag IDs.');

    await deleteThreadTags(input.tagIds);

    return getCommunityById(input.communityId);
  }
);
