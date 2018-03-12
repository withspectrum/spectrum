// @flow
import type { GraphQLContext } from '../../';
import UserError from '../../utils/UserError';
import sign from './sign';

export type InputType = {
  input: {
    objectName: string,
    contentType: string,
    id: string,
    entityType: string,
  },
};

export default (_: any, { input }: InputType, { user }: GraphQLContext) => {
  const currentUser = user;

  if (!currentUser) {
    return new UserError('You must be signed in to upload a photo.');
  }

  return sign({ ...input });
};
