import { graphql, gql } from 'react-apollo';

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
  {
    options: props => ({
      variables: { uid: props.uid },
    }),
    props: ({ data: { loading, user, fetchMore } }) => ({
      data: {
        loading,
        user,
        fetchMore: () =>
          fetchMore({
            query: MoreStoriesQuery,
            variables: {
              after: user.everything.edges[user.everything.edges.length - 1]
                .cursor,
            },
            updateQuery: (prev, { fetchMoreResult }) => {
              console.log('prev', prev, 'result', fetchMoreResult);
              if (!fetchMoreResult.user) {
                return prev;
              }
              return Object.assign({}, prev, {
                data: fetchMoreResult.user.everything.edges,
              });
            },
          }),
      },
    }),
  }
);

const MoreStoriesQuery = gql`
  query everything($after: String) {
    user: currentUser {
      everything(after: $after) {
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
          }
        }
      }
    }
  }
`;
