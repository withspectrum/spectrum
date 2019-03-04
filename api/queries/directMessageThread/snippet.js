// @flow

import type { GraphQLContext } from '../../';
import { canViewDMThread } from '../../utils/permissions';
import { toPlainText, toState } from 'shared/draft-utils';
import { messageTypeObj } from 'shared/draft-utils/process-message-content';

export default async (
  { id }: { id: string },
  _: any,
  { loaders, user }: GraphQLContext
) => {
  if (!user || !user.id) return null;

  const canViewThread = await canViewDMThread(user.id, id, loaders);
  if (!canViewThread) return null;

  return loaders.directMessageSnippet.load(id).then(message => {
    if (!message) return 'No messages yet...';
    if (message.messageType === 'media') return '📷 Photo';
    return message.messageType === messageTypeObj.draftjs
      ? toPlainText(toState(JSON.parse(message.content.body)))
      : message.content.body;
  });
};
