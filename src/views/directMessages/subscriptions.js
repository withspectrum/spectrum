import { gql } from 'react-apollo';
import { messageInfoFragment } from '../../api/fragments/message/messageInfo';

export const subscribeToNewMessages = gql`
	subscription subscribeToNewMessages($thread: ID!) {
		messageAdded(thread: $thread) {
			...messageInfo
		}
	}
	${messageInfoFragment}
`;
