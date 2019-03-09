// @flow

export const messageTypeObj = {
  text: 'text',
  media: 'media',
  draftjs: 'draftjs',
};
export type MessageType = $Keys<typeof messageTypeObj>;
