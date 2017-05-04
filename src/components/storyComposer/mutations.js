// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { storyInfoFragment } from '../../api/fragments/story/storyInfo';

export const publishStory = graphql(
  gql`
    mutation publishStory($story: StoryInput!) {
      publishStory(story: $story) {
        # When a story is published, we want to return extra metadata about
        # the new story to handle a few downstream operations:
        #
        # First, when a story is published, we notify the dashboard 'everything'
        # query and insert the new story into the stories list. That way if a
        # user publishes a story and navigates to the homepage, their story will
        # appear without needing to refetch
        #
        # Additionally, we want to get back the frequencyId and communityId
        # so that the community and frequency the story is posted under can
        # trigger their reducers and automatically add the new story to the
        # store. See 'views/community/queries.js' for an example of this
        # reducer operation in use.
        #
        # The underlying goal here is to ensure that when a story is published,
        # it will appear in all the feeds a user would expect it to appear
        # and play nicely with Apollo in th event that a feed was previously
        # fetched and cached
        ...storyInfo
        frequency {
          id
          slug
          community {
            id
            slug
          }
        }
      }
    }
    ${storyInfoFragment}
  `
);
