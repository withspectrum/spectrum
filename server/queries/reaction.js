// @flow

import { getReaction } from '../models/reaction';
import { getMessage } from '../models/message';
import type { LocationTypes } from '../models/message';
import type { GraphQLContext } from '../';

type Root = {
  id: string,
  user: string,
  message: string,
};

type QueryArgs = {
  id: string,
};

type MessageArgs = {
  location: LocationTypes,
};

const reaction = {
  Query: {
    reaction: (_: Root, { id }: QueryArgs) => getReaction(id),
  },
  Reaction: {
    user: ({ user }: Root, _: any, { loaders }: GraphQLContext) =>
      loaders.user.load(user),
    message: ({ message }: Root, { location }: MessageArgs) =>
      getMessage(location, message),
  },
};

module.exports = reaction;
