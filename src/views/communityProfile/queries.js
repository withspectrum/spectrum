import { graphql, gql } from 'react-apollo';

const MoreStoriesQuery = gql`
  query community($slug: String, $after: String) {
    community(slug: $slug) {
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
      slug: match.params.communitySlug,
    },
  }),
  props: ({ data: { fetchMore, error, loading, community } }) => ({
    data: {
      error,
      loading,
      community,
      stories: community ? community.storyConnection.edges : '',
      fetchMore: () =>
        fetchMore({
          query: MoreStoriesQuery,
          variables: {
            after: community.storyConnection.edges[
              community.storyConnection.edges.length - 1
            ].cursor,
            slug: community.slug,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult.community) {
              return prev;
            }
            return {
              ...prev,
              community: {
                ...prev.community,
                storyConnection: {
                  ...prev.community.storyConnection,
                  edges: [
                    ...prev.community.storyConnection.edges,
                    ...fetchMoreResult.community.storyConnection.edges,
                  ],
                },
              },
            };
          },
        }),
    },
  }),
};

export const getCommunity = graphql(
  gql`
		query getCommunity($slug: String) {
			community(slug: $slug) {
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

const queryOptionsCommunityProfile = {
  options: ({ match }) => ({
    variables: {
      slug: match.params.communitySlug,
    },
  }),
};

export const getCommunityProfile = graphql(
  gql`
		query getCommunityProfile($slug: String) {
			community(slug: $slug) {
        id
        name
        slug
        metaData {
          frequencies
          members
        }
      }
		}
	`,
  queryOptionsCommunityProfile
);
