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
  // props: ({ data: { loading, user, fetchMore } }) => ({
  //   data: {
  //     loading,
  //     user,
  //     fetchMore: () =>
  //       fetchMore({
  //         query: MoreStoriesQuery,
  //         variables: {
  //           after: user.everything.edges[user.everything.edges.length - 1]
  //             .cursor,
  //         },
  //         updateQuery: (prev, { fetchMoreResult }) => {
  //           console.log('prev', prev, 'result', fetchMoreResult);
  //
  //           if (!fetchMoreResult.user) {
  //             return prev;
  //           }
  //
  //           // Add the new stories to the list
  //           return {
  //             user: {
  //               ...prev.user,
  //               everything: {
  //                 ...prev.user.everything,
  //                 edges: [
  //                   ...prev.user.everything.edges,
  //                   // NOTE(@mxstbr): The __typename hack is to work around react-apollo/issues/658
  //                   fetchMoreResult.user.everything.edges,
  //                 ],
  //               },
  //             },
  //           };
  //         },
  //       }),
  //   },
  // }),
  props: ({ data: { fetchMore, loading, user } }) => ({
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
