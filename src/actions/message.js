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

export const editMessage = (id: string) => {
  return {
    type: 'EDIT_MESSAGE',
    messageId: id,
  };
};

export const cancelMessageEdit = (id: string) => {
  return {
    type: 'EDIT_MESSAGE_CANCEL',
  };
};

export type ReplyToMessageActionType = $Call<typeof replyToMessage, ReplyInput>;
