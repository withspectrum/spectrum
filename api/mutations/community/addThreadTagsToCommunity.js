// @flow
import { addThreadTag } from '../../models/threadTags';
import {
  isAuthedResolver,
  canModerateCommunity,
} from '../../utils/permissions';
import { getCommunityById } from '../../models/community';
import UserError from '../../utils/UserError';
import type { GraphQLContext } from '../../';

type AddThreadTagsToCommunityInput = {
  input: {
    tags: Array<{ title: string, hex: string }>,
    communityId: string,
  },
};

export default isAuthedResolver(
  async (
    _: void,
    { input }: AddThreadTagsToCommunityInput,
    { user, loaders }: GraphQLContext
  ) => {
    if (!(await canModerateCommunity(user.id, input.communityId, loaders)))
      return new UserError(
        "You cannot add thread tags to a community if you're not a team member"
      );

    await Promise.all(
      input.tags.map(tag => addThreadTag(tag, input.communityId))
    );

    return getCommunityById(input.communityId);
  }
);
