import { graphql, gql } from 'react-apollo';

export const getUserMetaData = graphql(
  gql`
    query user($id: ID!) {
      user(id: $id) {
        metaData {
          stories
        }
      }
    }
`,
  {
    options: ({ id }) => ({ variables: { id } }),
  }
);

export const getFrequencyMetaData = graphql(
  gql`
    query frequency($id: ID!) {
      frequency(id: $id) {
        metaData {
          stories
          subscribers
        }
      }
    }
`,
  {
    options: ({ id }) => ({ variables: { id } }),
  }
);

export const getCommunityMetaData = graphql(
  gql`
    query community($id: ID!) {
      community(id: $id) {
        metaData {
          frequencies
          members
        }
      }
    }
`,
  {
    options: ({ id }) => ({ variables: { id } }),
  }
);
