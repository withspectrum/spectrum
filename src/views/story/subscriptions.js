import { graphql, gql } from 'react-apollo';

export const subscribeToNewMessages = gql`
	subscription subscribeToNewMessages($thread: ID!) {
		messageAdded(location: messages, thread: $thread) {
			id
			message {
				type
				content
			}
		}
	}
`;
