// @flow
// Determine whether a DraftJS message is short
import { toPlainText, toState } from '../../../draft-utils';

import type { RawDraftContentState } from 'draft-js';
import type { MessageInfoType } from '../../../graphql/fragments/message/messageInfo';

export const isShort = (message: MessageInfoType): boolean => {
  if (message.messageType === 'media') return false;
  const jsonBody = JSON.parse(message.content.body);
  return (
    jsonBody.blocks.length <= 1 && toPlainText(toState(jsonBody)).length <= 170
  );
};
