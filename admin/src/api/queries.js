import { graphql, gql } from 'react-apollo';
import { userInfoFragment } from './fragments/user/userInfo';
import { userCommunitiesFragment } from './fragments/user/userCommunities';

const META_INFORMATION_QUERY = gql`
  query {
    meta {
      usersGrowth {
        count
        weeklyGrowth
        monthlyGrowth
        quarterlyGrowth
      }
      communitiesGrowth {
        count
        weeklyGrowth
        monthlyGrowth
        quarterlyGrowth
      }
      channelsGrowth {
        count
        weeklyGrowth
        monthlyGrowth
        quarterlyGrowth
      }
      threadsGrowth {
        count
        weeklyGrowth
        monthlyGrowth
        quarterlyGrowth
      }
      directMessageThreadsGrowth {
        count
        weeklyGrowth
        monthlyGrowth
        quarterlyGrowth
      }
      threadMessagesGrowth {
        count
        weeklyGrowth
        monthlyGrowth
        quarterlyGrowth
      }
      directMessagesGrowth {
        count
        weeklyGrowth
        monthlyGrowth
        quarterlyGrowth
      }
    }
  }
`;

export const overviewQuery = graphql(META_INFORMATION_QUERY);

const USER_INFORMATION_QUERY = gql`
  query {
    meta {
      userGrowth {
        createdAt
      }
    }
  }
`;

export const usersQuery = graphql(USER_INFORMATION_QUERY);

export const SEARCH_USERS_QUERY = gql`
  query searchUsers($string: String) {
    searchUsers(string: $string) {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;

export const GET_USER_BY_USERNAME_QUERY = gql`
  query user($username: String) {
    user(username: $username) {
      ...userInfo
      ...userCommunities
    }
  }
  ${userInfoFragment}
  ${userCommunitiesFragment}
`;

export const GET_USER_BY_USERNAME_OPTIONS = {
  options: ({ username }) => ({
    variables: {
      username,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getUserByUsername = graphql(
  GET_USER_BY_USERNAME_QUERY,
  GET_USER_BY_USERNAME_OPTIONS
);
