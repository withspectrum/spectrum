// @flow
import type { GraphQLContext } from '../../';
import type { DBUser } from 'shared/types';
import { signImageUrl } from 'shared/imgix';

export default ({ coverPhoto }: DBUser, _: any, ctx: GraphQLContext) => {
  return signImageUrl(coverPhoto, {
    w: 1280,
    h: 384,
    expires: ctx.getImageSignatureExpiration(),
  });
};
