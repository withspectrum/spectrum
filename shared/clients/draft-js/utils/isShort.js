// @flow
import type { MessageInfoType } from '../../../graphql/fragments/message/messageInfo';

export const isShort = (message: MessageInfoType): boolean => {
  if (message.messageType === 'media') return false;
  const jsonBody = JSON.parse(message.content.body);
  return (
    jsonBody.blocks.length <= 1 &&
    jsonBody.blocks
      .filter(block => block.type === 'unstyled')
      .map(block => block.text).length <= 170
  );
};
