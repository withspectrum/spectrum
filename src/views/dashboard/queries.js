// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
// $FlowFixMe
import update from 'immutability-helper';
import { encode } from '../../helpers/utils';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import {
  userEverythingFragment,
} from '../../api/fragments/user/userEverything';
import {
  userCommunitiesFragment,
} from '../../api/fragments/user/userCommunities';
import { userMetaDataFragment } from '../../api/fragments/user/userMetaData';

const LoadMoreStories = gql`
  query loadMoreEverythingStories($after: String) {
    user: currentUser {
      ...userInfo
      ...userCommunities
      ...userEverything
    }
  }
  ${userInfoFragment}
  ${userEverythingFragment}
  ${userCommunitiesFragment}
`;

const storiesQueryOptions = {
  props: ({ data: { fetchMore, error, loading, user } }) => ({
    data: {
      error,
      loading,
      user,
      stories: user ? user.everything.edges : '',
      hasNextPage: user ? user.everything.pageInfo.hasNextPage : false,
      fetchMore: () =>
        fetchMore({
          query: LoadMoreStories,
          variables: {
            after: user.everything.edges[user.everything.edges.length - 1]
              .cursor,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.user) {
              return prev;
            }
            return {
              ...prev,
              user: {
                ...prev.user,
                everything: {
                  ...prev.user.everything,
                  pageInfo: {
                    ...prev.user.everything.pageInfo,
                    ...fetchMoreResult.user.everything.pageInfo,
                  },
                  edges: [
                    ...prev.user.everything.edges,
                    ...fetchMoreResult.user.everything.edges,
                  ],
                },
              },
            };
          },
        }),
    },
  }),
  options: ({ params }) => ({
    reducer: (prev, action, variables) => {
      if (
        action.type === 'APOLLO_MUTATION_RESULT' &&
        action.operationName === 'publishStory'
      ) {
        const newStory = action.result.data.publishStory;
        const cursor = encode(newStory.id);
        const newEdge = {
          cursor,
          node: {
            ...newStory,
          },
        };
        return update(prev, {
          user: {
            everything: {
              edges: {
                $unshift: [newEdge],
              },
            },
          },
        });
      }
      return prev;
    },
  }),
};

export const getEverythingStories = graphql(
  gql`
  query getEverythingStories($after: String) {
    user: currentUser {
      ...userInfo
      ...userCommunities
      ...userEverything
    }
  }
  ${userInfoFragment}
  ${userEverythingFragment}
  ${userCommunitiesFragment}
`,
  storiesQueryOptions
);

/*
  Loads the sidebar profile component widget independent of the story feed.
  In the future we can compose these queries together since they are fetching
  such similar data, but for now we're making a decision to keep the data
  queries specific to each component.
*/
export const getCurrentUserProfile = graphql(
  gql`
    query getCurrentUserProfile {
			user: currentUser {
        ...userInfo
        ...userMetaData
      }
		}
    ${userInfoFragment}
    ${userMetaDataFragment}
	`
);

export const GET_CURRENT_USER_COMMUNITIES_QUERY = gql`
  query currentUserCommunities {
    user: currentUser {
      ...userCommunities
    }
  }
  ${userCommunitiesFragment}
`;

export const GET_CURRENT_USER_COMMUNITIES_OPTIONS = {
  props: ({ data: { error, loading, user } }) => ({
    data: {
      error,
      loading,
      communities: user ? user.communityConnection.edges : '',
    },
  }),
};

export const getCurrentUserCommunities = graphql(
  GET_CURRENT_USER_COMMUNITIES_QUERY,
  GET_CURRENT_USER_COMMUNITIES_OPTIONS
);
