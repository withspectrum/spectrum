// @flow
import { createFrequency, deleteFrequency } from '../models/frequency';
import type { CreateFrequencyArguments } from '../models/frequency';

type Context = {
  user: Object,
};

module.exports = {
  Mutation: {
    createFrequency: (
      _: any,
      args: CreateFrequencyArguments,
      { user }: Context
    ) => createFrequency(args, user.uid),
    deleteFrequency: (_: any, { id }) => deleteFrequency(id), //TODO: Add permission checks here
  },
};
