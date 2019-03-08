// @flow
import { toPlainText } from './plaintext';
import type { MessageInfoType } from '../../../graphql/fragments/message/messageInfo';

export const isShort = (message: MessageInfoType): boolean => {
  if (message.messageType === 'media') return false;
  const jsonBody = JSON.parse(message.content.body);
  return jsonBody.blocks.length <= 1 && toPlainText(jsonBody).length <= 170;
};
