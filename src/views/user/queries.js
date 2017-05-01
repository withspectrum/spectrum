import { graphql, gql } from 'react-apollo';

const MoreStoriesQuery = gql`
  query user($username: String, $after: String) {
    user(username: $username) {
      uid
      username
      storyConnection(first: 10, after: $after) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            id
            messageCount
            author {
              uid
              photoURL
              displayName
              username
            }
            content {
              title
              description
            }
          }
        }
      }
    }
  }
`;

const queryOptions = {
  options: ({ username }) => ({
    variables: {
      username: username,
    },
  }),
  props: ({ data: { fetchMore, error, loading, user } }) => ({
    data: {
      error,
      loading,
      user,
      stories: user ? user.storyConnection.edges : '',
      fetchMore: () =>
        fetchMore({
          query: MoreStoriesQuery,
          variables: {
            after: user.storyConnection.edges[
              user.storyConnection.edges.length - 1
            ].cursor,
            username: user.username,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.user) {
              return prev;
            }
            return {
              ...prev,
              user: {
                ...prev.user,
                storyConnection: {
                  ...prev.user.storyConnection,
                  edges: [
                    ...prev.user.storyConnection.edges,
                    ...fetchMoreResult.user.storyConnection.edges,
                  ],
                },
              },
            };
          },
        }),
    },
  }),
};

export const getUser = graphql(
  gql`
		query getUser($username: String) {
			user(username: $username) {
        uid
        username
        storyConnection(first: 10) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              id
              messageCount
              author {
                uid
                photoURL
                displayName
                username
              }
              content {
                title
                description
              }
            }
          }
        }
      }
		}
	`,
  queryOptions
);

const queryOptionsUserProfile = {
  options: ({ username }) => ({
    variables: {
      username: username,
    },
  }),
};

export const getUserProfile = graphql(
  gql`
		query getUserProfile($username: String) {
			user(username: $username) {
        uid
        username
        photoURL
        displayName
        email
        metaData {
          stories
        }
      }
		}
	`,
  queryOptionsUserProfile
);
