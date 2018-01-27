// @flow
import type { DBCommunity } from 'shared/types';
import type { GraphQLContext } from '../../';

type MemberOrChannelCount = {
  reduction?: number,
};

export default ({ id }: DBCommunity, _: any, { loaders }: GraphQLContext) => {
  // $FlowIssue
  return Promise.all([
    loaders.communityChannelCount.load(id),
    loaders.communityMemberCount.load(id),
  ]).then(
    (
      [channelCount, memberCount]: [MemberOrChannelCount, MemberOrChannelCount]
    ) => ({
      channels: channelCount ? channelCount.reduction : 0,
      members: memberCount ? memberCount.reduction : 0,
    })
  );
};
