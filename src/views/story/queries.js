import { graphql, gql } from 'react-apollo';

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
