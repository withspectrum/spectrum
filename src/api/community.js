// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { communityInfoFragment } from './fragments/community/communityInfo';
import { communityMetaDataFragment } from './fragments/community/communityMetaData';
import { channelInfoFragment } from './fragments/channel/channelInfo';
import { userInfoFragment } from './fragments/user/userInfo';
import { channelMetaDataFragment } from './fragments/channel/channelMetaData';

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
        update: (proxy, { data: { createCommunity } }) => {
          proxy.writeQuery({
            query: GET_COMMUNITY_QUERY,
            variables: {
              slug: input.slug,
            },
            data: createCommunity,
          });
        },
        // update: (proxy, { data: { createCommunity } }) => {
        //   // read the data from the cache for the queries this affects
        //   const data = proxy.readQuery({
        //     query: GET_CURRENT_USER_COMMUNITIES_QUERY,
        //   });
        //
        //   // insert the new community
        //   data.user.communityConnection.edges.push({
        //     node: {
        //       ...createCommunity,
        //     },
        //   });
        //
        //   // write the new data back to the cache
        //   proxy.writeQuery({ query: GET_CURRENT_USER_COMMUNITIES_QUERY, data });
        // },
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
		query getCommunity($id: ID) {
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
