import { graphql, gql } from 'react-apollo';

export const publishStory = graphql(
  gql`
    mutation addStory($story: StoryContentInput!) {
      addStory(story: $story) {
        id
        author {
          name
        }
      }
    }
  `
);
