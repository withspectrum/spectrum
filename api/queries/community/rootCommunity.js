// @flow
import type { GraphQLContext } from '../../';

type GetCommunityById = {
  id: string,
  slug: void,
};

type GetCommunityBySlug = {
  id: void,
  slug: string,
};

type GetCommunityArgs = GetCommunityById | GetCommunityBySlug;

export default (
  _: any,
  args: GetCommunityArgs,
  { loaders }: GraphQLContext
) => {
  if (args.id) return loaders.community.load(args.id);
  if (args.slug) return loaders.communityBySlug.load(args.slug);

  return null;
};
