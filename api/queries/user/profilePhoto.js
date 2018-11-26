// @flow
import type { GraphQLContext } from '../../';
import type { DBUser } from 'shared/types';
import { signUser } from 'shared/imgix';

export default (user: DBUser, _: any, ctx: GraphQLContext) => {
  const expires = ctx.getImageSignatureExpiration();
  const { profilePhoto } = signUser(user, expires);
  return profilePhoto;
};
