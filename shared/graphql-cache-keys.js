// @flow
export const communityChannelCount = (id: string) =>
  `community:${id}:channelCount`;
export const communityOnlineMemberCount = (id: string) =>
  `community:${id}:onlineMemberCount`;
export const channelOnlineMemberCount = (id: string) =>
  `channel:${id}:onlineMemberCount`;
