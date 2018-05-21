// @flow
import * as React from 'react';
import { NotificationListContainer } from '../style';
import { parseNotification } from '../utils';
import { sortByDate } from '../../../helpers/utils';
import { MiniNewMessageNotification } from './newMessageNotification';
import { MiniNewReactionNotification } from './newReactionNotification';
import { MiniNewChannelNotification } from './newChannelNotification';
import { MiniNewThreadNotification } from './newThreadNotification';
import { MiniNewUserInCommunityNotification } from './newUserInCommunityNotification';
import { MiniCommunityInviteNotification } from './communityInviteNotification';
import { MiniMentionMessageNotification } from './mentionMessageNotification';
import { MiniMentionThreadNotification } from './mentionThreadNotification';
import { MiniPrivateChannelRequestSent } from './privateChannelRequestSentNotification';
import { MiniPrivateChannelRequestApproved } from './privateChannelRequestApprovedNotification';
import { SentryErrorBoundary } from 'src/components/error';

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
                <SentryErrorBoundary fallbackComponent={null}>
                  <MiniNewMessageNotification
                    key={notification.id}
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                  />
                </SentryErrorBoundary>
              );
            }
            case 'REACTION_CREATED': {
              return (
                <SentryErrorBoundary fallbackComponent={null}>
                  <MiniNewReactionNotification
                    key={notification.id}
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                  />
                </SentryErrorBoundary>
              );
            }
            case 'CHANNEL_CREATED': {
              return (
                <SentryErrorBoundary fallbackComponent={null}>
                  <MiniNewChannelNotification
                    key={notification.id}
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                    markSingleNotificationAsSeenInState={
                      markSingleNotificationAsSeenInState
                    }
                  />
                </SentryErrorBoundary>
              );
            }
            case 'USER_JOINED_COMMUNITY': {
              return (
                <SentryErrorBoundary fallbackComponent={null}>
                  <MiniNewUserInCommunityNotification
                    key={notification.id}
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                    markSingleNotificationAsSeenInState={
                      markSingleNotificationAsSeenInState
                    }
                  />
                </SentryErrorBoundary>
              );
            }
            case 'THREAD_CREATED': {
              return (
                <SentryErrorBoundary fallbackComponent={null}>
                  <MiniNewThreadNotification
                    key={notification.id}
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                    markSingleNotificationAsSeenInState={
                      markSingleNotificationAsSeenInState
                    }
                  />
                </SentryErrorBoundary>
              );
            }
            case 'COMMUNITY_INVITE': {
              return (
                <SentryErrorBoundary fallbackComponent={null}>
                  <MiniCommunityInviteNotification
                    key={notification.id}
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                    markSingleNotificationAsSeenInState={
                      markSingleNotificationAsSeenInState
                    }
                  />
                </SentryErrorBoundary>
              );
            }
            case 'MENTION_THREAD': {
              return (
                <SentryErrorBoundary fallbackComponent={null}>
                  <MiniMentionThreadNotification
                    key={notification.id}
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                  />
                </SentryErrorBoundary>
              );
            }
            case 'MENTION_MESSAGE': {
              return (
                <SentryErrorBoundary fallbackComponent={null}>
                  <MiniMentionMessageNotification
                    key={notification.id}
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                  />
                </SentryErrorBoundary>
              );
            }
            case 'PRIVATE_CHANNEL_REQUEST_SENT': {
              return (
                <SentryErrorBoundary fallbackComponent={null}>
                  <MiniPrivateChannelRequestSent
                    key={notification.id}
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                    markSingleNotificationAsSeenInState={
                      markSingleNotificationAsSeenInState
                    }
                  />
                </SentryErrorBoundary>
              );
            }
            case 'PRIVATE_CHANNEL_REQUEST_APPROVED': {
              return (
                <SentryErrorBoundary fallbackComponent={null}>
                  <MiniPrivateChannelRequestApproved
                    key={notification.id}
                    notification={notification}
                    currentUser={currentUser}
                    history={history}
                    markSingleNotificationAsSeenInState={
                      markSingleNotificationAsSeenInState
                    }
                  />
                </SentryErrorBoundary>
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
