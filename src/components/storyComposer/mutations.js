// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { storyInfoFragment } from '../../api/fragments/story/storyInfo';

export const publishStory = graphql(
  gql`
    mutation publishStory($story: StoryInput!) {
      publishStory(story: $story) {
        ...storyInfo
      }
    }
    ${storyInfoFragment}
  `
);
