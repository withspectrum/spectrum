// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { communityInfoFragment } from '../../api/fragments/community/communityInfo';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import { threadInfoFragment } from '../../api/fragments/thread/threadInfo';
import { communityMetaDataFragment } from '../../api/fragments/community/communityMetaData';

export const getThisCommunity = graphql(
  gql`
    query community($slug: String) {
      community(slug: $slug) {
        ...communityInfo
        ...communityMetaData
      }
    }
    ${communityInfoFragment}
    ${communityMetaDataFragment}
  `,
  {
    options: props => ({
      variables: {
        slug: props.communitySlug.toLowerCase(),
      },
      fetchPolicy: 'network-only',
    }),
  }
);

const COMMUNITY_GROWTH_QUERY = gql`
  query getCommunityMemberGrowth($slug: String) {
    community(slug: $slug) {
      ...communityInfo
      memberGrowth {
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
  ${communityInfoFragment}
`;

const COMMUNITY_GROWTH_OPTIONS = {
  options: ({ communitySlug }: { communitySlug: string }) => ({
    variables: {
      slug: communitySlug.toLowerCase(),
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getCommunityMemberGrowth = graphql(
  COMMUNITY_GROWTH_QUERY,
  COMMUNITY_GROWTH_OPTIONS
);

const COMMUNITY_CONVERSATION_GROWTH_QUERY = gql`
  query getCommunityConversationGrowth($slug: String) {
    community(slug: $slug) {
      ...communityInfo
      conversationGrowth {
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
  ${communityInfoFragment}
`;

const COMMUNITY_CONVERSATION_GROWTH_OPTIONS = {
  options: ({ communitySlug }: { communitySlug: string }) => ({
    variables: {
      slug: communitySlug.toLowerCase(),
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getCommunityConversationGrowth = graphql(
  COMMUNITY_CONVERSATION_GROWTH_QUERY,
  COMMUNITY_CONVERSATION_GROWTH_OPTIONS
);

const COMMUNITY_TOP_MEMBERS_QUERY = gql`
  query getCommunityTopMembers($slug: String) {
    community(slug: $slug) {
      ...communityInfo
      topMembers {
        ...userInfo
        isPro
        contextPermissions {
          reputation
          isOwner
          isModerator
        }
      }
    }
  }
  ${communityInfoFragment}
  ${userInfoFragment}
`;

const COMMUNITY_TOP_MEMBERS_OPTIONS = {
  options: ({ communitySlug }: { communitySlug: string }) => ({
    variables: {
      slug: communitySlug.toLowerCase(),
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getCommunityTopMembers = graphql(
  COMMUNITY_TOP_MEMBERS_QUERY,
  COMMUNITY_TOP_MEMBERS_OPTIONS
);

const COMMUNITY_TOP_NEW_THREADS_QUERY = gql`
  query getCommunityTopAndNewThreads($slug: String) {
    community(slug: $slug) {
      ...communityInfo
      topAndNewThreads {
        topThreads {
          ...threadInfo
        }
        newThreads {
          ...threadInfo
        }
      }
    }
  }
  ${communityInfoFragment}
  ${threadInfoFragment}
`;

const COMMUNITY_TOP_NEW_THREADS_OPTIONS = {
  options: ({ communitySlug }: { communitySlug: string }) => ({
    variables: {
      slug: communitySlug.toLowerCase(),
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getCommunityTopAndNewThreads = graphql(
  COMMUNITY_TOP_NEW_THREADS_QUERY,
  COMMUNITY_TOP_NEW_THREADS_OPTIONS
);
