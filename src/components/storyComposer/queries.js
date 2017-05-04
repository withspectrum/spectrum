import { graphql, gql } from 'react-apollo';

export const getComposerCommunitiesAndFrequencies = graphql(
  gql`
  query getComposerCommunitiesAndFrequencies {
    user: currentUser {
      communityConnection {
        edges {
          node {
            id
            name
            slug
            frequencyConnection {
              edges {
                node {
                  id
                  name
                  slug
                  community {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
);
