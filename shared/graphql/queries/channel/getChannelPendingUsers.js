// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';

type Node = {
  ...$Exact<UserInfoType>,
};

export type GetChannelPendingUsersType = {
  ...$Exact<ChannelInfoType>,
  pendingUsers: Array<?Node>,
};

export const getChannelPendingUsersQuery = gql`
  query getChannelPendingUsers($id: ID) {
    channel(id: $id) {
      ...channelInfo
      pendingUsers {
        ...userInfo
      }
    }
  }
  ${userInfoFragment}
  ${channelInfoFragment}
`;

const getChannelPendingUsersOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export default graphql(
  getChannelPendingUsersQuery,
  getChannelPendingUsersOptions
);
