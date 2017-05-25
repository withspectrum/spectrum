import { graphql, gql } from 'react-apollo';

export const getNotifications = graphql(
  gql`
	{
		notifications {
      edges {
        node {
          id
    			type
    			channel {
    				name
    				slug
    			}
    			community {
    				name
    				slug
    			}
    			thread {
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
    				username
            profilePhoto
            id
    			}
        }
      }
		}
	}`
);
