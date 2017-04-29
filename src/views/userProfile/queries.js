import { graphql, gql } from 'react-apollo';

const MoreStoriesQuery = gql`
  query frequency($id: ID, $after: String) {
    frequency(id: $id) {
      id
      name
      slug
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
  options: ({ match }) => ({
    variables: {
      username: match.params.userId,
    },
  }),
  props: ({ data: { fetchMore, error, loading, user } }) => ({
    data: {
      error,
      loading,
      user,
      stories: user ? user.storyConnection.edges : '',
      // fetchMore: () =>
      //   fetchMore({
      //     query: MoreStoriesQuery,
      //     variables: {
      //       after: frequency.storyConnection.edges[
      //         frequency.storyConnection.edges.length - 1
      //       ].cursor,
      //       id: frequency.id,
      //     },
      //     updateQuery: (prev, { fetchMoreResult }) => {
      //       if (!fetchMoreResult.frequency) {
      //         return prev;
      //       }
      //       return {
      //         ...prev,
      //         frequency: {
      //           ...prev.frequency,
      //           storyConnection: {
      //             ...prev.frequency.storyConnection,
      //             edges: [
      //               ...prev.frequency.storyConnection.edges,
      //               ...fetchMoreResult.frequency.storyConnection.edges,
      //             ],
      //           },
      //         },
      //       };
      //     },
      //   }),
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
