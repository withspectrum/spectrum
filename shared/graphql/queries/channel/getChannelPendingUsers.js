// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from 'shared/graphql/fragments/user/userInfo';
import channelInfoFragment from 'shared/graphql/fragments/channel/channelInfo';

const getChannelPendingUsersQuery = gql`
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
