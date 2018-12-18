// @flow

import type { GraphQLContext } from '../../';
import { canViewDMThread } from '../../utils/permissions';
import { toPlainText, toState } from 'shared/draft-utils';

export default async (root: any, _: any, { loaders, user }: GraphQLContext) => {
  const { id } = root;

  if (!user || !user.id) return null;

  const canViewThread = await canViewDMThread(user.id, id, loaders);
  if (!canViewThread) return null;

  return loaders.directMessageSnippet.load(id).then(message => {
    if (!message || !message.content.body) return 'No messages yet...';
    if (message.messageType === 'media') return '📷 Photo';
    return message.messageType === 'draftjs'
      ? toPlainText(toState(JSON.parse(message.content.body)))
      : message.content.body;
  });
};
