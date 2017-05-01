import { graphql, gql, createFragment } from 'react-apollo';

const userFragments = {
  userInfo: gql`
    fragment userInfo on User {
      uid
      photoURL
      displayName
      username
    }
  `,
  userMetaData: gql`
    fragment userMetaData on User {
      stories
    }
  `,
  userCommunities: gql`
    fragment userCommunities on User {
      communityConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            ...communityInfo
          }
        }
      }
    }
    ${communityFragments.communityInfo}
  `,
  userFrequencies: gql`
    fragment userFrequencies on User {
      frequencyConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            ...frequencyInfo
          }
        }
      }
    }
    ${frequencyFragments.frequencyInfo}
  `,
  userStories: gql`
    fragment userStories on User {
      storyConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            ...storyInfo
          }
        }
      }
    }
    ${storyFragments.storyInfo}
  `,
};

const storyFragments = {
  storyInfo: gql`
    fragment storyInfo on Story {
      id
      messageCount
      author {
        ...userInfo
      }
      content {
        title
        description
      }
    }
    ${userFragments.userInfo}
  `,
};

const frequencyFragments = {
  frequencyInfo: gql`
    fragment frequencyInfo on Frequency {
      id
      name
      slug
      description
      community {
        ...communityInfo
      }
    }
    ${communityFragments.communityInfo}
  `,
  frequencySubscribers: gql`
    fragment frequencySubscribers on Frequency {
      subscriberConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            ...userInfo
          }
        }
      }
    }
    ${userFragments.userInfo}
  `,
  frequencyStories: gql`
    fragment frequencyStories on Frequency {
      storyConnection(first: 10, after: $after) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            ...storyInfo
          }
        }
      }
    }
    ${storyFragments.storyInfo}
  `,
};

const communityFragments = {
  communityStories: gql`
    fragment communityStories on Community {
      storyConnection(first: 10, after: $after) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            ...storyInfo
          }
        }
      }
    }
    ${storyFragments.storyInfo}
  `,
  communityInfo: gql`
    fragment communityInfo on Community {
      id
      name
      slug
    }
  `,
  communityMetaData: gql`
    fragment communityMetaData on Community {
      metaData {
        frequencies
        members
      }
    }
  `,
};

const LoadMoreStories = gql`
  query community($slug: String, $after: String) {
    community(slug: $slug) {
      ...communityInfo
      ...communityStories
    }
  }
  ${communityFragments.communityInfo}
  ${communityFragments.communityStories}
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
          query: LoadMoreStories,
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
		query community($slug: String, $after: String) {
			community(slug: $slug) {
        ...communityInfo
        ...communityStories
      }
		}
    ${communityFragments.communityStories}
    ${communityFragments.communityInfo}
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
        ...communityInfo
        ...communityMetaData
      }
		}
    ${communityFragments.communityInfo}
    ${communityFragments.communityMetaData}
	`,
  queryOptionsCommunityProfile
);
