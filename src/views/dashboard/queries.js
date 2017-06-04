// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
// $FlowFixMe
import update from 'immutability-helper';
import { encode } from '../../helpers/utils';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import {
  communityInfoFragment,
} from '../../api/fragments/community/communityInfo';
import {
  userEverythingFragment,
} from '../../api/fragments/user/userEverything';
import {
  userCommunitiesFragment,
} from '../../api/fragments/user/userCommunities';
// import { userMetaDataFragment } from '../../api/fragments/user/userMetaData';

const LoadMoreThreads = gql`
  query loadMoreEverythingThreads($after: String) {
    user: currentUser {
      id
      ...userEverything
    }
  }
  ${userEverythingFragment}
`;

const threadsQueryOptions = {
  props: ({ data: { fetchMore, error, loading, user } }) => ({
    data: {
      error,
      loading,
      user,
      threads: user ? user.everything.edges : '',
      hasNextPage: user ? user.everything.pageInfo.hasNextPage : false,
      fetchMore: () =>
        fetchMore({
          query: LoadMoreThreads,
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
        action.operationName === 'publishThread'
      ) {
        const newThread = action.result.data.publishThread;
        const cursor = encode(newThread.id);
        const newEdge = {
          cursor,
          node: {
            ...newThread,
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

export const getEverythingThreads = graphql(
  gql`
  query getEverythingThreads($after: String) {
    user: currentUser {
      id
      ...userEverything
    }
  }
  ${userEverythingFragment}
`,
  threadsQueryOptions
);

/*
  Loads the sidebar profile component widget independent of the thread feed.
  In the future we can compose these queries together since they are fetching
  such similar data, but for now we're making a decision to keep the data
  queries specific to each component.
*/
export const getCurrentUserProfile = graphql(
  gql`
    query getCurrentUserProfile {
			user: currentUser {
        ...userInfo
        ...userCommunities
      }
		}
    ${userInfoFragment}
    ${userCommunitiesFragment}
	`
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
  }
);
