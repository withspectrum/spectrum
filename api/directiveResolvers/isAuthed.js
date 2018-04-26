// @flow
import UserError from '../utils/UserError';
import type { GraphQLContext } from '../';

export default (next: Function, _: any, __: any, { user }: GraphQLContext) => {
  if (user && user.id) return next();
  throw new UserError(`You must be signed in to do this`);
};
