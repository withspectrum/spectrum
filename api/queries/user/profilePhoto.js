// @flow
import type { GraphQLContext } from '../../';
import type { DBUser } from 'shared/types';
import { signUser } from 'shared/imgix';

export default (user: DBUser, _: any, ctx: GraphQLContext) => {
  const { profilePhoto } = signUser(user);
  return profilePhoto;
};
