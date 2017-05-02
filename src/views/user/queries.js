// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import { userStoriesFragment } from '../../api/fragments/user/userStories';
import { userMetaDataFragment } from '../../api/fragments/user/userMetaData';

const LoadMoreStories = gql`
  query loadMoreUserStories($username: String, $after: String) {
    user(username: $username) {
      ...userInfo
      ...userStories
    }
  }
  ${userInfoFragment}
  ${userStoriesFragment}
`;

const storiesQueryOptions = {
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
          query: LoadMoreStories,
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

export const getUserStories = graphql(
  gql`
		query getUserStories($username: String, $after: String) {
			user(username: $username) {
        ...userInfo
        ...userStories
      }
		}
    ${userInfoFragment}
    ${userStoriesFragment}
	`,
  storiesQueryOptions
);

/*
  Loads the sidebar profile component widget independent of the story feed.
  In the future we can compose these queries together since they are fetching
  such similar data, but for now we're making a decision to keep the data
  queries specific to each component.
*/
const profileQueryOptions = {
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
        ...userInfo
        ...userMetaData
      }
		}
    ${userInfoFragment}
    ${userMetaDataFragment}
	`,
  profileQueryOptions
);
