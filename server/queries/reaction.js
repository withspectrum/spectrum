// @flow

import { getUser } from '../models/user';
import { getReaction } from '../models/reaction';
import { getMessage } from '../models/message';
import type { LocationTypes } from '../models/message';

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
    user: ({ user }: Root) => getUser({ uid: user }),
    message: ({ message }: Root, { location }: MessageArgs) =>
      getMessage(location, message),
  },
};

module.exports = reaction;
