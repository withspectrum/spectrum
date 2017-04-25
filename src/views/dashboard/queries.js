import { graphql, gql } from 'react-apollo';

export const getEverything = graphql(
  gql`
  {
    user: currentUser {
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
      variables: { uid: props.uid },
    }),
  }
);
