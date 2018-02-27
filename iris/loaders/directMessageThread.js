// @flow
import { getDirectMessageThreads } from '../models/directMessageThread';
import { getMembersInDirectMessageThreads } from '../models/usersDirectMessageThreads';
import { getLastMessages } from '../models/message';
import createLoader from './create-loader';
import type { Loader } from './types';

export const __createDirectMessageThreadLoader = createLoader(threads =>
  getDirectMessageThreads(threads)
);

export const __createDirectMessageParticipantsLoader = createLoader(
  threads => getMembersInDirectMessageThreads(threads),
  { indexField: 'group' }
);

export const __createDirectMessageSnippetLoader = createLoader(
  threads => getLastMessages(threads),
  { indexField: 'group' }
);

export default () => {
  throw new Error(
    '⚠️ Do not import loaders directly, get them from the GraphQL context instead! ⚠️'
  );
};
