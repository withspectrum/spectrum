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
  options: ({ slug, community }) => ({
    variables: {
      slug: console.log(slug, community) || slug,
      community: community,
    },
  }),
  props: ({ data: { fetchMore, error, loading, frequency } }) => ({
    data: {
      error,
      loading,
      frequency,
      stories: frequency ? frequency.storyConnection.edges : '',
      fetchMore: () =>
        fetchMore({
          query: MoreStoriesQuery,
          variables: {
            after: frequency.storyConnection.edges[
              frequency.storyConnection.edges.length - 1
            ].cursor,
            id: frequency.id,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.frequency) {
              return prev;
            }
            return {
              ...prev,
              frequency: {
                ...prev.frequency,
                storyConnection: {
                  ...prev.frequency.storyConnection,
                  edges: [
                    ...prev.frequency.storyConnection.edges,
                    ...fetchMoreResult.frequency.storyConnection.edges,
                  ],
                },
              },
            };
          },
        }),
    },
  }),
};

export const getFrequency = graphql(
  gql`
		query getFrequency($slug: String, $community: String) {
			frequency(slug: $slug, community: $community) {
        id
        name
        slug
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

const queryOptionsFrequencyProfile = {
  options: ({ slug, community }) => ({
    variables: {
      slug: console.log(slug, community) || slug,
      community: community,
    },
  }),
};

export const getFrequencyProfile = graphql(
  gql`
		query getFrequencyProfile($slug: String, $community: String) {
			frequency(slug: $slug, community: $community) {
        id
        name
        slug
        community {
          id
          name
          slug
        }
        metaData {
          stories
          subscribers
        }
      }
		}
	`,
  queryOptionsFrequencyProfile
);
