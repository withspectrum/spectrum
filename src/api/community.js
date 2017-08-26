// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { communityInfoFragment } from './fragments/community/communityInfo';
import { threadInfoFragment } from './fragments/thread/threadInfo';
import { communityMetaDataFragment } from './fragments/community/communityMetaData';
import { channelInfoFragment } from './fragments/channel/channelInfo';
import { userInfoFragment } from './fragments/user/userInfo';
import { invoiceInfoFragment } from './fragments/invoice/invoiceInfo';
import { channelMetaDataFragment } from './fragments/channel/channelMetaData';
import { GET_THREAD_QUERY } from '../views/thread/queries';

const profileQueryOptions = {
  options: ({ match: { params: { communitySlug } } }) => ({
    variables: {
      slug: communitySlug.toLowerCase(),
    },
    fetchPolicy: 'cache-and-network',
  }),
};

const GET_COMMUNITY_QUERY = gql`
  query getCommunity($slug: String) {
    community(slug: $slug) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

export const getCommunity = graphql(GET_COMMUNITY_QUERY, profileQueryOptions);

/*
  Create a new community
*/
const CREATE_COMMUNITY_MUTATION = gql`
  mutation createCommunity($input: CreateCommunityInput!) {
    createCommunity (input: $input) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const CREATE_COMMUNITY_OPTIONS = {
  props: ({ input, mutate }) => ({
    createCommunity: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export const createCommunityMutation = graphql(
  CREATE_COMMUNITY_MUTATION,
  CREATE_COMMUNITY_OPTIONS
);

/*
  Delete a community
*/
const DELETE_COMMUNITY_MUTATION = gql`
  mutation deleteCommunity($communityId: ID!) {
    deleteCommunity(communityId: $communityId)
  }
`;

const DELETE_COMMUNITY_OPTIONS = {
  props: ({ communityId, mutate }) => ({
    deleteCommunity: communityId =>
      mutate({
        variables: {
          communityId,
        },
      }),
  }),
};

export const deleteCommunityMutation = graphql(
  DELETE_COMMUNITY_MUTATION,
  DELETE_COMMUNITY_OPTIONS
);

/*
  Edit a new community
*/
const EDIT_COMMUNITY_MUTATION = gql`
  mutation editCommunity($input: EditCommunityInput!) {
    editCommunity (input: $input) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const EDIT_COMMUNITY_OPTIONS = {
  props: ({ input, mutate }) => ({
    editCommunity: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export const editCommunityMutation = graphql(
  EDIT_COMMUNITY_MUTATION,
  EDIT_COMMUNITY_OPTIONS
);

/*
  Join or leave a community
*/
const TOGGLE_COMMUNITY_MEMBERSHIP_MUTATION = gql`
  mutation toggleCommunityMembership($communityId: ID!) {
    toggleCommunityMembership (communityId: $communityId) {
      ...communityInfo
      channelConnection {
        edges {
          node {
            ...channelInfo
            ...channelMetaData
            pendingUsers {
              ...userInfo
            }
          }
        }
      }
    }
  }
  ${communityInfoFragment}
  ${channelInfoFragment}
  ${userInfoFragment}
  ${channelMetaDataFragment}
`;

const TOGGLE_COMMUNITY_MEMBERSHIP_OPTIONS = {
  props: ({ communityId, mutate }) => ({
    toggleCommunityMembership: ({ communityId }) =>
      mutate({
        variables: {
          communityId,
        },
      }),
  }),
};

export const toggleCommunityMembershipMutation = graphql(
  TOGGLE_COMMUNITY_MEMBERSHIP_MUTATION,
  TOGGLE_COMMUNITY_MEMBERSHIP_OPTIONS
);

/*
  Checks a slug against the db to make sure a community with that slug
  doesn't already exist
*/
export const CHECK_UNIQUE_COMMUNITY_SLUG_QUERY = gql`
  query community($slug: String) {
    community(slug: $slug) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const LoadMoreMembers = gql`
  query loadMoreCommunityMembers($id: ID, $after: String) {
    community(id: $id) {
      id
      ...communityMetaData
      memberConnection(after: $after) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            ...userInfo
          }
        }
      }
    }
  }
  ${userInfoFragment}
  ${communityMetaDataFragment}
`;

const getCommunityMembersOptions = {
  props: ({
    data: { fetchMore, error, loading, community, networkStatus },
  }) => ({
    data: {
      error,
      loading,
      community,
      networkStatus: networkStatus,
      hasNextPage: community
        ? community.memberConnection.pageInfo.hasNextPage
        : false,
      fetchMore: () =>
        fetchMore({
          query: LoadMoreMembers,
          variables: {
            id: community.id,
            after:
              community.memberConnection.edges[
                community.memberConnection.edges.length - 1
              ].cursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.community) {
              return prev;
            }

            return {
              ...prev,
              community: {
                ...prev.community,
                memberConnection: {
                  ...prev.community.memberConnection,
                  pageInfo: {
                    ...prev.community.memberConnection.pageInfo,
                    ...fetchMoreResult.community.memberConnection.pageInfo,
                  },
                  edges: [
                    ...prev.community.memberConnection.edges,
                    ...fetchMoreResult.community.memberConnection.edges,
                  ],
                },
              },
            };
          },
        }),
    },
  }),
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const getCommunityMembersQuery = graphql(
  gql`
		query getCommunityMembers($id: ID) {
      community(id: $id) {
        id
        ...communityMetaData
        memberConnection {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              ...userInfo
            }
          }
        }
      }
		}
    ${userInfoFragment}
    ${communityMetaDataFragment}
	`,
  getCommunityMembersOptions
);

export const getCommunityByIdQuery = gql`
  query getCommunity($id: ID) {
    community(id: $id) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const getCommunityByIdOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export const getCommunityById = graphql(
  getCommunityByIdQuery,
  getCommunityByIdOptions
);

const SEND_EMAIL_INVITATIONS_MUTATION = gql`
  mutation sendEmailInvites($input: EmailInvitesInput!) {
    sendEmailInvites(input: $input)
  }
`;
const SEND_EMAIL_INVITATIONS_OPTIONS = {
  props: ({ input, mutate }) => ({
    sendEmailInvites: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export const sendEmailInvitationsMutation = graphql(
  SEND_EMAIL_INVITATIONS_MUTATION,
  SEND_EMAIL_INVITATIONS_OPTIONS
);

export const SEARCH_COMMUNITIES_QUERY = gql`
  query searchCommunities($string: String) {
    searchCommunities(string: $string) {
      ...communityInfo
      ...communityMetaData
    }
  }
  ${communityInfoFragment}
  ${communityMetaDataFragment}
`;

const GET_COMMUNITY_INVOICES_OPTIONS = {
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'network-only',
  }),
};

const GET_COMMUNITY_INVOICES_QUERY = gql`
  query getCommunityInvoices($id: ID) {
    community(id: $id) {
      id
      invoices {
        ...invoiceInfo
      }
    }
  }
  ${invoiceInfoFragment}
`;

export const getCommunityInvoices = graphql(
  GET_COMMUNITY_INVOICES_QUERY,
  GET_COMMUNITY_INVOICES_OPTIONS
);

const PIN_THREAD_MUTATION = gql`
  mutation pinThread($threadId: ID!, $communityId: ID!, $value: String) {
    pinThread(threadId: $threadId, communityId: $communityId, value: $value) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;
const PIN_THREAD_OPTIONS = {
  props: ({ mutate }) => ({
    pinThread: ({ threadId, communityId, value }) =>
      mutate({
        variables: {
          threadId,
          communityId,
          value,
        },
        update: (store, { data: { pinThread } }) => {
          const data = store.readQuery({
            query: GET_THREAD_QUERY,
            variables: {
              id: threadId,
            },
          });

          const newVal = Object.assign({}, ...data, {
            ...data,
            channel: {
              ...data.channel,
              __typename: 'Channel',
              community: {
                ...pinThread,
                __typename: 'Community',
              },
            },
            __typename: 'Thread',
          });

          // Write our data back to the cache.
          store.writeQuery({
            query: GET_THREAD_QUERY,
            data: newVal,
          });
        },
      }),
  }),
};
export const pinThreadMutation = graphql(
  PIN_THREAD_MUTATION,
  PIN_THREAD_OPTIONS
);

export const SEARCH_THREADS_IN_COMMUNITY_QUERY = gql`
  query searchCommunityThreads($communityId: ID!, $searchString: String!) {
    searchCommunityThreads(communityId: $communityId, searchString: $searchString) {
      ...threadInfo
    }
  }
  ${threadInfoFragment}
`;

const SEARCH_THREADS_IN_COMMUNITY_OPTIONS = {
  props: ({
    data: { fetchMore, error, loading, searchCommunityThreads, networkStatus },
  }) => ({
    data: {
      error,
      loading,
      networkStatus,
      threads: searchCommunityThreads
        ? searchCommunityThreads.map(thread => ({ node: { ...thread } }))
        : [],
    },
  }),
  options: ({ communityId, searchString }) => ({
    variables: {
      communityId,
      searchString,
    },
    fetchPolicy: 'cache-and-network',
  }),
};

export const searchCommunityThreadsQuery = graphql(
  SEARCH_THREADS_IN_COMMUNITY_QUERY,
  SEARCH_THREADS_IN_COMMUNITY_OPTIONS
);

/*
  Gets top communities for the onboarding flow.
*/
export const getTopCommunities = graphql(
  gql`
		{
		  topCommunities {
        ...communityInfo
        metaData {
          members
        }
      }
    }
    ${communityInfoFragment}
	`,
  {
    props: ({ data: { error, loading, topCommunities } }) => ({
      data: {
        error,
        loading,
        topCommunities,
      },
    }),
    options: { fetchPolicy: 'cache-and-network' },
  }
);

/*
  Get a current user's recurring payments
*/
const GET_COMMUNITY_RECURRING_PAYMENTS_QUERY = gql`
  query getCommunityRecurringPayments($id: ID!) {
    community(id: $id) {
      ...communityInfo
      recurringPayments {
        plan
        amount
        createdAt
        status
      }
    }
  }
  ${communityInfoFragment}
`;

export const getCommunityRecurringPayments = graphql(
  GET_COMMUNITY_RECURRING_PAYMENTS_QUERY,
  {
    options: ({ id }) => ({
      variables: {
        id,
      },
    }),
  }
);
