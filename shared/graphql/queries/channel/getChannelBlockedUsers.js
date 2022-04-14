// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

type Node = {
  ...$Exact<UserInfoType>,
};

export type GetChannelBlockedUsersType = {
  ...$Exact<ChannelInfoType>,
  blockedUsers?: Array<?Node>,
};

export const getChannelBlockedUsersQuery = gql`
  query getChannelBlockedUsers($id: ID) {
    channel(id: $id) {
      ...channelInfo
      blockedUsers {
        ...userInfo
      }
    }
  }
  ${userInfoFragment}
  ${communityInfoFragment}
  ${channelInfoFragment}
`;

const getChannelBlockedUsersOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getChannelBlockedUsersQuery,
  getChannelBlockedUsersOptions
);
