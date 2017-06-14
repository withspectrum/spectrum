// @flow
// $FlowFixMe
import { gql } from 'react-apollo';
import { messageInfoFragment } from './fragments/message/messageInfo';
import {
  notificationInfoFragment,
} from './fragments/notification/notificationInfo';

export const subscribeToNewMessages = gql`
	subscription subscribeToNewMessages($thread: ID!) {
		messageAdded(thread: $thread) {
			...messageInfo
		}
	}
	${messageInfoFragment}
`;

export const subscribeToNewNotifications = gql`
  subscription subscribeToNewNotifications {
    notificationAdded {
      ...notificationInfo
    }
  }
  ${notificationInfoFragment}
`;
