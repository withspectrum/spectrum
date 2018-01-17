// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from 'shared/graphql/fragments/user/userInfo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';
import channelInfoFragment from 'shared/graphql/fragments/channel/channelInfo';

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
