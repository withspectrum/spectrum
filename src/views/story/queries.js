import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

export const getStory = graphql(
  gql`
  query story($id: ID!) {
    story(id: $id) {
      id
      locked
      content {
        title
        description
      }
      author {
        displayName
      }
      frequency {
        id
        name
      }
    }
  }
`,
  {
    options: props => ({
      variables: { id: props.match.params.storyId },
    }),
  }
);
