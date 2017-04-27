import { graphql, gql } from 'react-apollo';

export const getUserMetaData = graphql(
  gql`
    query user ($id: ID!) {
      user(id: $id) {
        metaData {
          storiesCount
        }
      }
    }
`,
  {
    options: ({ id }) => ({ variables: { id } }),
  }
);
