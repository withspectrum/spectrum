import { graphql, gql } from 'react-apollo';

const MoreStoriesQuery = gql`
  query everything($after: String) {
    user: currentUser {
      uid
      lastSeen
      photoURL
      displayName
      username
      email
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
      communityConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            id
            name
            slug
            frequencyConnection {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`;

const queryOptions = {
  props: ({ data: { fetchMore, error, loading, user } }) => ({
    data: {
      error,
      loading,
      user,
      stories: user ? user.everything.edges : '',
      fetchMore: () =>
        fetchMore({
          query: MoreStoriesQuery,
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

export const getEverything = graphql(
  gql`
  {
    user: currentUser {
      uid
      lastSeen
      photoURL
      displayName
      username
      email
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
      communityConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            id
            name
            slug
            frequencyConnection {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`,
  queryOptions
);
