// @flow
import type { GraphQLContext } from '../../';
import type { DBUser } from 'shared/types';
import { signImageUrl } from 'shared/imgix';

export default ({ profilePhoto }: DBUser, _: any, ctx: GraphQLContext) => {
  return signImageUrl(profilePhoto, {
    w: 256,
    h: 256,
    expires: ctx.getImageSignatureExpiration(),
  });
};
