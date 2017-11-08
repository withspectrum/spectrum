import { graphql, gql } from 'react-apollo';
import { userInfoFragment } from './fragments/user/userInfo';
import { threadInfoFragment } from './fragments/thread/threadInfo';
import { userCommunitiesFragment } from './fragments/user/userCommunities';

const META_INFORMATION_QUERY = gql`
  query {
    meta {
      coreMetrics {
        dau
        wau
        mau
        dac
        wac
        mac
        cpu
        mpu
        tpu
        users
        communities
        threads
        dmThreads
        threadMessages
        dmMessages
        date
      }
      usersGrowth {
        count
        dau
        wau
        mau
        weeklyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        monthlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        quarterlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
      }
      communitiesGrowth {
        count
        weeklyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        monthlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        quarterlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
      }
      channelsGrowth {
        count
        weeklyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        monthlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        quarterlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
      }
      threadsGrowth {
        count
        weeklyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        monthlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        quarterlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
      }
      directMessageThreadsGrowth {
        count
        weeklyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        monthlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        quarterlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
      }
      threadMessagesGrowth {
        count
        weeklyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        monthlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        quarterlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
      }
      directMessagesGrowth {
        count
        weeklyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        monthlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        quarterlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
      }
    }
  }
`;

export const overviewQuery = graphql(META_INFORMATION_QUERY);

const USER_INFORMATION_QUERY = gql`
  query {
    meta {
      usersGrowth {
        count
        dau
        wau
        mau
        weeklyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        monthlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
        quarterlyGrowth {
          growth
          currentPeriodCount
          prevPeriodCount
        }
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

export const GET_TOP_THREADS_QUERY = gql`
  query getTopThreads {
    meta {
      topThreads {
        ...threadInfo
      }
    }
  }
  ${threadInfoFragment}
`;

export const GET_TOP_THREADS_OPTIONS = {
  options: () => ({
    fetchPolicy: 'cache-and-network',
  }),
};

export const topThreadsQuery = graphql(
  GET_TOP_THREADS_QUERY,
  GET_TOP_THREADS_OPTIONS
);

export const IS_ADMIN_QUERY = gql`
  query isAdmin {
    meta {
      isAdmin
    }
  }
`;
export const isAdmin = graphql(IS_ADMIN_QUERY);
