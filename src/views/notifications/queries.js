import { graphql, gql } from 'react-apollo';

export const getNotifications = graphql(
  gql`
	{
		notifications {
      edges {
        node {
          id
    			type
    			frequency {
    				name
    				slug
    			}
    			community {
    				name
    				slug
    			}
    			story {
    				id
    			}
    			message {
    				id
    			}
    			content {
    				title
    				excerpt
    			}
    			read
    			createdAt
    			sender {
    				displayName
    				username
            photoURL
            uid
    			}
        }
      }
		}
	}`
);
