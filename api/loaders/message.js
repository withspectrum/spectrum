// @flow
import { getManyMessages } from '../models/message';
import createLoader from './create-loader';
import type { Loader } from './types';

export const __createMessageLoader = createLoader((messages: string[]) =>
  getManyMessages(messages)
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
