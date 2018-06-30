// @flow
import * as React from 'react';
import { ErrorBoundary } from 'src/components/error';
import { NotificationListContainer } from '../style';
import { parseNotification } from '../utils';
import { sortByDate } from '../../../helpers/utils';
import { MiniNewMessageNotification } from './newMessageNotification';
import { MiniNewReactionNotification } from './newReactionNotification';
import { MiniNewThreadReactionNotification } from './newThreadReactionNotification';
import { MiniNewChannelNotification } from './newChannelNotification';
import { MiniNewThreadNotification } from './newThreadNotification';
import { MiniNewUserInCommunityNotification } from './newUserInCommunityNotification';
import { MiniCommunityInviteNotification } from './communityInviteNotification';
import { MiniMentionMessageNotification } from './mentionMessageNotification';
import { MiniMentionThreadNotification } from './mentionThreadNotification';
import { MiniPrivateChannelRequestSent } from './privateChannelRequestSentNotification';
import { MiniPrivateChannelRequestApproved } from './privateChannelRequestApprovedNotification';
import { MiniPrivateCommunityRequestSent } from './privateCommunityRequestSentNotification';
import { MiniPrivateCommunityRequestApproved } from './privateCommunityRequestApprovedNotification';

type Props = {
  rawNotifications: Array<Object>,
  currentUser: Object,
  history: Object,
  markSingleNotificationAsSeenInState: Function,
};
export class NotificationDropdownList extends React.Component<Props> {
  render() {
    const {
      rawNotifications,
      currentUser,
      history,
      markSingleNotificationAsSeenInState,
    } = this.props;

    let notifications = rawNotifications
      .map(notification => parseNotification(notification))
      .slice(0, 10)
      .filter(
        notification => notification.context.type !== 'DIRECT_MESSAGE_THREAD'
      );

    notifications = sortByDate(notifications, 'modifiedAt', 'desc');

    return (
      <NotificationListContainer>
        {notifications.map(notification => {
          switch (notification.event) {
            case 'MESSAGE_CREATED': {
              return (
                <ErrorBoundary fallbackComponent={null} key={notification.id}>
                  <MiniNewMessageNotification
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                  />
                </ErrorBoundary>
              );
            }
            case 'REACTION_CREATED': {
              return (
                <ErrorBoundary fallbackComponent={null} key={notification.id}>
                  <MiniNewReactionNotification
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                  />
                </ErrorBoundary>
              );
            }
            case 'THREAD_REACTION_CREATED': {
              return (
                <ErrorBoundary fallbackComponent={null} key={notification.id}>
                  <MiniNewThreadReactionNotification
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                  />
                </ErrorBoundary>
              );
            }
            case 'CHANNEL_CREATED': {
              return (
                <ErrorBoundary fallbackComponent={null} key={notification.id}>
                  <MiniNewChannelNotification
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                    markSingleNotificationAsSeenInState={
                      markSingleNotificationAsSeenInState
                    }
                  />
                </ErrorBoundary>
              );
            }
            case 'USER_JOINED_COMMUNITY': {
              return (
                <ErrorBoundary fallbackComponent={null} key={notification.id}>
                  <MiniNewUserInCommunityNotification
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                    markSingleNotificationAsSeenInState={
                      markSingleNotificationAsSeenInState
                    }
                  />
                </ErrorBoundary>
              );
            }
            case 'THREAD_CREATED': {
              return (
                <ErrorBoundary fallbackComponent={null} key={notification.id}>
                  <MiniNewThreadNotification
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                    markSingleNotificationAsSeenInState={
                      markSingleNotificationAsSeenInState
                    }
                  />
                </ErrorBoundary>
              );
            }
            case 'COMMUNITY_INVITE': {
              return (
                <ErrorBoundary fallbackComponent={null} key={notification.id}>
                  <MiniCommunityInviteNotification
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                    markSingleNotificationAsSeenInState={
                      markSingleNotificationAsSeenInState
                    }
                  />
                </ErrorBoundary>
              );
            }
            case 'MENTION_THREAD': {
              return (
                <ErrorBoundary fallbackComponent={null} key={notification.id}>
                  <MiniMentionThreadNotification
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                  />
                </ErrorBoundary>
              );
            }
            case 'MENTION_MESSAGE': {
              return (
                <ErrorBoundary fallbackComponent={null} key={notification.id}>
                  <MiniMentionMessageNotification
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                  />
                </ErrorBoundary>
              );
            }
            case 'PRIVATE_CHANNEL_REQUEST_SENT': {
              return (
                <ErrorBoundary fallbackComponent={null} key={notification.id}>
                  <MiniPrivateChannelRequestSent
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                    markSingleNotificationAsSeenInState={
                      markSingleNotificationAsSeenInState
                    }
                  />
                </ErrorBoundary>
              );
            }
            case 'PRIVATE_CHANNEL_REQUEST_APPROVED': {
              return (
                <ErrorBoundary fallbackComponent={null} key={notification.id}>
                  <MiniPrivateChannelRequestApproved
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                    markSingleNotificationAsSeenInState={
                      markSingleNotificationAsSeenInState
                    }
                  />
                </ErrorBoundary>
              );
            }
            case 'PRIVATE_COMMUNITY_REQUEST_SENT': {
              return (
                <ErrorBoundary fallbackComponent={null} key={notification.id}>
                  <MiniPrivateCommunityRequestSent
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                    markSingleNotificationAsSeenInState={
                      markSingleNotificationAsSeenInState
                    }
                  />
                </ErrorBoundary>
              );
            }
            case 'PRIVATE_COMMUNITY_REQUEST_APPROVED': {
              return (
                <ErrorBoundary fallbackComponent={null} key={notification.id}>
                  <MiniPrivateCommunityRequestApproved
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                    markSingleNotificationAsSeenInState={
                      markSingleNotificationAsSeenInState
                    }
                  />
                </ErrorBoundary>
              );
            }
            default: {
              return null;
            }
          }
        })}
      </NotificationListContainer>
    );
  }
}
