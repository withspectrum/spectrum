// @flow

import type { GraphQLContext } from '../../';
import { canViewDMThread } from './utils';
import { toPlainText, toState } from 'shared/draft-utils';

export default async (
  { id }: { id: string },
  _: any,
  { loaders, user }: GraphQLContext
) => {
  if (!user || !user.id) return null;

  const canViewThread = await canViewDMThread(id, user.id, { loaders });

  if (!canViewThread) return null;

  return loaders.directMessageSnippet.load(id).then(results => {
    if (!results) return 'No messages yet...';
    const message = results.reduction;
    return message.messageType === 'draftjs'
      ? toPlainText(toState(JSON.parse(message.content.body)))
      : message.content.body;
  });
};
