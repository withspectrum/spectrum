// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import {
  userCommunitiesFragment,
} from '../../api/fragments/user/userCommunities';
import { userMetaDataFragment } from '../../api/fragments/user/userMetaData';

const LoadMoreStories = gql`
  query loadMoreEverythingStories($after: String) {
    user: currentUser {
      ...userInfo
      everything(first: 10, after: $after){
  			pageInfo {
  			  hasNextPage
  			  hasPreviousPage
  			}
        edges {
          cursor
          node {
            id
            createdAt
            content {
              title
              description
            }
            author {
              displayName
            }
            messageCount
          }
        }
      }
      ...userCommunities
    }
  }
  ${userInfoFragment}
  ${userCommunitiesFragment}
`;

const storiesQueryOptions = {
  props: ({ data: { fetchMore, error, loading, user } }) => ({
    data: {
      error,
      loading,
      user,
      stories: user ? user.everything.edges : '',
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
};

export const getEverythingStories = graphql(
  gql`
  {
    user: currentUser {
      ...userInfo
      everything(first: 10){
  			pageInfo {
  			  hasNextPage
  			  hasPreviousPage
  			}
        edges {
          cursor
          node {
            id
            createdAt
            content {
              title
              description
            }
            author {
              displayName
            }
            messageCount
          }
        }
      }
      ...userCommunities
    }
  }
  ${userInfoFragment}
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
    {
			user: currentUser {
        ...userInfo
        ...userMetaData
      }
		}
    ${userInfoFragment}
    ${userMetaDataFragment}
	`
);
