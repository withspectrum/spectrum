// @flow

import { getUser } from '../models/user';
import { getMessage } from '../models/message';
import type { LocationTypes } from '../models/message';

type Root = {
  id: string,
  user: string,
  message: string,
};

type Args = {
  location: LocationTypes,
};

const reaction = {
  Reaction: {
    user: ({ user }: Root) => getUser(user),
    message: ({ message }: Root, { location }: Args) =>
      getMessage(location, message),
  },
};

module.exports = reaction;
