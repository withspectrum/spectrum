// @flow

export const replyToMessage = (messageId: string | null) => {
  return {
    type: 'REPLY_TO_MESSAGE',
    messageId,
  };
};

export type ReplyToMessageActionType = $Call<
  typeof replyToMessage,
  string | null
>;
