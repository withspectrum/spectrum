import { graphql, gql } from 'react-apollo';

export const getEverything = graphql(
  gql`
  query user($id: ID!) {
    user(id: $id) {
      photoURL
      displayName
      username
      everything(first: 10){
  			pageInfo {
  			  hasNextPage
  			  hasPreviousPage
  			}
        edges {
          node {
            id
            createdAt
            content {
              title
              description
            }
            author {
              displayName
            }
          }
        }
      }
      communityConnection {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          node {
            id
            name
            slug
            frequencyConnection {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                node {
                  id
                }
              }
            }
          }
        }
      }
    }
  }
`,
  {
    options: props => ({
      variables: { id: '1105e003-629b-4aef-a561-b1fc7db831fd' },
    }),
  }
);
