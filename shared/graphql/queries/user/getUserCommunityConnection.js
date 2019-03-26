// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';
import userCommunityConnectionFragment from '../../fragments/user/userCommunityConnection';
import { subscribeToUpdatedCommunities } from '../../subscriptions';
import type { UserCommunityConnectionType } from '../../fragments/user/userCommunityConnection';

export type GetUserCommunityConnectionType = {
  ...$Exact<UserInfoType>,
  totalReputation: number,
  ...$Exact<UserCommunityConnectionType>,
};

export const getUserCommunityConnectionQuery = gql`
  query getUserCommunityConnection($id: ID) {
    user(id: $id) {
      ...userInfo
      ...userCommunityConnection
    }
  }
  ${userInfoFragment}
  ${userCommunityConnectionFragment}
`;

export const getCurrentUserCommunityConnectionQuery = gql`
  query getCurrentUserCommunityConnection {
    user: currentUser {
      ...userInfo
      ...userCommunityConnection
    }
  }
  ${userInfoFragment}
  ${userCommunityConnectionFragment}
`;

const getUserCommunityConnectionOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getCurrentUserCommunityConnection = graphql(
  getCurrentUserCommunityConnectionQuery,
  {
    options: { fetchPolicy: 'cache-first' },
    props: props => ({
      ...props,
      subscribeToUpdatedCommunities: communityIds => {
        const variables = communityIds
          ? {
              variables: {
                communityIds,
              },
            }
          : {};
        return props.data.subscribeToMore({
          document: subscribeToUpdatedCommunities,
          ...variables,
          // No need to do anything fancy here, Apollo Client will automatically update the community by its ID
          updateQuery: prev => prev,
        });
      },
    }),
  }
);

export const getUserCommunityConnection = graphql(
  getUserCommunityConnectionQuery,
  getUserCommunityConnectionOptions
);
