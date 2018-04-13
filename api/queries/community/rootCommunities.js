// @flow
import type { GraphQLContext } from '../../';
import { getCuratedCommunities } from '../../models/curatedContent';

type GetCommunitiesByIds = {
  ids: Array<string>,
  slugs: void,
  curatedContentType: void,
};

type GetCommunitiesBySlugs = {
  ids: void,
  slugs: Array<string>,
  curatedContentType: void,
};

type GetCuratedContent = {
  ids: void,
  slugs: void,
  curatedContentType: string,
};

type GetCommunitiesArgs =
  | GetCommunitiesByIds
  | GetCommunitiesBySlugs
  | GetCuratedContent;

export default (
  _: any,
  args: GetCommunitiesArgs,
  { loaders }: GraphQLContext
) => {
  if (args.curatedContentType) {
    return getCuratedCommunities(args.curatedContentType);
  }
  if (args.ids) return loaders.community.loadMany(args.ids);
  if (args.slugs) return loaders.communityBySlug.loadMany(args.slugs);
  return null;
};
