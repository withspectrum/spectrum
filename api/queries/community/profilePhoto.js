// @flow
import type { GraphQLContext } from '../../';
import type { DBCommunity } from 'shared/types';
import { signCommunity } from 'shared/imgix';

export default (community: DBCommunity, _: any, ctx: GraphQLContext) => {
  const expires = ctx.getImageSignatureExpiration();
  const { profilePhoto } = signCommunity(community, expires);
  return profilePhoto;
};
