// @flow
import { editThreadTag } from '../../models/threadTags';
import {
  isAuthedResolver,
  canModerateCommunity,
} from '../../utils/permissions';
import { getCommunityById } from '../../models/community';
import UserError from '../../utils/UserError';
import type { GraphQLContext } from '../../';
import validateStringAsHexValue from '../../../shared/validate-string-as-hex-value';

type EditThreadTagInCommunityInput = {
  input: {
    tagId: string,
    communityId: string,
    title: string,
    hex: string,
  },
};

export default isAuthedResolver(
  async (
    _: void,
    { input }: EditThreadTagInCommunityInput,
    { user, loaders }: GraphQLContext
  ) => {
    if (!(await canModerateCommunity(user.id, input.communityId, loaders)))
      return new UserError(
        "You cannot delete thread tags if you're not a team member."
      );

    if (!validateStringAsHexValue(input.hex))
      return new UserError('Invalid hex value for tag');

    const tag = await loaders.threadTags.load(input.tagId);

    if (!tag) return new UserError('Tag with this id wasn’t found');

    await editThreadTag(input);

    return await getCommunityById(input.communityId);
  }
);
