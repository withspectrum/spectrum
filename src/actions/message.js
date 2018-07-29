// @flow

type ReplyInput = {|
  threadId: string,
  messageId: ?string,
|};

export const replyToMessage = (input: ReplyInput) => {
  return {
    type: 'REPLY_TO_MESSAGE',
    messageId: input ? input.messageId : null,
    threadId: input.threadId,
  };
};

export const editMessage = (messageId: String) => {
  return {
    type: 'EDIT_MESSAGE',
    messageId: messageId,
  };
};

export type ReplyToMessageActionType = $Call<typeof replyToMessage, ReplyInput>;
