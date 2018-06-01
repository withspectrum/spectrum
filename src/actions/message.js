// @flow

type ReplyInput = {|
  threadId: string,
  messageId: ?string,
  snippet: ?string,
|};

export const replyToMessage = (input: ReplyInput) => {
  return {
    type: 'REPLY_TO_MESSAGE',
    messageId: input ? input.messageId : null,
    threadId: input.threadId,
    snippet: input.snippet,
  };
};

export type ReplyToMessageActionType = $Call<typeof replyToMessage, ReplyInput>;
