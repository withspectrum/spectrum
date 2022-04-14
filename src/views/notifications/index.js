// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { parseNotification } from './utils';
import { NewMessageNotification } from './components/newMessageNotification';
import { NewReactionNotification } from './components/newReactionNotification';
import { NewThreadReactionNotification } from './components/newThreadReactionNotification';
import { NewChannelNotification } from './components/newChannelNotification';
import { CommunityInviteNotification } from './components/communityInviteNotification';
import { MentionMessageNotification } from './components/mentionMessageNotification';
import { MentionThreadNotification } from './components/mentionThreadNotification';
import { NewUserInCommunityNotification } from './components/newUserInCommunityNotification';
import { PrivateChannelRequestApproved } from './components/privateChannelRequestApprovedNotification';
import { PrivateChannelRequestSent } from './components/privateChannelRequestSentNotification';
import { PrivateCommunityRequestApproved } from './components/privateCommunityRequestApprovedNotification';
import { PrivateCommunityRequestSent } from './components/privateCommunityRequestSentNotification';
import Head from 'src/components/head';
import { withCurrentUser } from 'src/components/withCurrentUser';
import { sortByDate } from 'src/helpers/utils';
import WebPushManager from 'src/helpers/web-push-manager';
import { addToastWithTimeout } from 'src/actions/toasts';
import getNotifications from 'shared/graphql/queries/notification/getNotifications';
import markNotificationsSeenMutation from 'shared/graphql/mutations/notification/markNotificationsSeen';
import markSingleNotificationSeenMutation from 'shared/graphql/mutations/notification/markSingleNotificationSeen';
import { subscribeToWebPush } from 'shared/graphql/subscriptions';
import generateMetaInfo from 'shared/generate-meta-info';
import { setTitlebarProps } from 'src/actions/titlebar';
import viewNetworkHandler, {
  type ViewNetworkHandlerType,
} from 'src/components/viewNetworkHandler';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from 'src/components/error';
import { isDesktopApp } from 'src/helpers/desktop-app-utils';
import { useConnectionRestored } from 'src/hooks/useConnectionRestored';
import type { WebsocketConnectionType } from 'src/reducers/connectionStatus';
import { ViewGrid } from 'src/components/layout';
import { ErrorView, LoadingView } from 'src/views/viewHelpers';
import { StyledSingleColumn, StickyHeader } from './style';
import { updateNotificationsCount } from 'src/actions/notifications';
import NextPageButton from 'src/components/nextPageButton';
import { PrimaryButton, OutlineButton } from 'src/components/button';

type Props = {
  markAllNotificationsSeen?: Function,
  markSingleNotificationSeen: Function,
  subscribeToWebPush: Function,
  dispatch: Dispatch<Object>,
  currentUser: Object,
  isFetchingMore: boolean,
  ...$Exact<ViewNetworkHandlerType>,
  data: {
    networkStatus: number,
    fetchMore: Function,
    hasNextPage: boolean,
    notifications: {
      edges: Array<Object>,
    },
    refetch: Function,
  },
  networkOnline: boolean,
  websocketConnection: WebsocketConnectionType,
};

type State = {
  showWebPushPrompt: boolean,
  webPushPromptLoading: boolean,
};

class NotificationsPure extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      showWebPushPrompt: false,
      webPushPromptLoading: false,
    };
  }

  markAllNotificationsSeen = () => {
    this.props.dispatch(updateNotificationsCount('notifications', 0));
    this.props.markAllNotificationsSeen &&
      this.props.markAllNotificationsSeen().catch(err => {
        console.error('Error marking all notifications seen: ', err);
      });
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(
      setTitlebarProps({
        title: 'Notifications',
        rightAction: (
          <OutlineButton onClick={() => this.markAllNotificationsSeen()}>
            Mark all seen
          </OutlineButton>
        ),
      })
    );

    WebPushManager.getPermissionState()
      .then(result => {
        // If it's denied, forgetabboutit
        if (
          result === 'denied' ||
          (result !== 'prompt' && result !== 'granted')
        ) {
          this.setState({
            showWebPushPrompt: false,
          });
          return;
        }

        WebPushManager.getSubscription()
          .then(subscription => {
            this.setState({
              showWebPushPrompt: !subscription,
            });
            return;
          })
          .catch(err => {
            console.error('Error getting subscription:', err);
          });
      })
      .catch(err => {
        console.error('Error getting permission state:', err);
      });
  }

  shouldComponentUpdate(nextProps: Props) {
    const curr = this.props;
    if (curr.networkOnline !== nextProps.networkOnline) return true;
    if (curr.websocketConnection !== nextProps.websocketConnection) return true;
    // fetching more
    if (curr.data.networkStatus === 7 && nextProps.data.networkStatus === 3)
      return false;
    return true;
  }

  componentDidUpdate(prev: Props) {
    const curr = this.props;
    const didReconnect = useConnectionRestored({ curr, prev });
    if (didReconnect && curr.data.refetch) {
      curr.data.refetch();
    }
  }

  subscribeToWebPush = () => {
    this.setState({
      webPushPromptLoading: true,
    });
    WebPushManager.subscribe()
      .then(subscription => {
        this.setState({
          webPushPromptLoading: false,
          showWebPushPrompt: false,
        });
        return this.props.subscribeToWebPush(subscription);
      })
      .catch(err => {
        this.setState({
          webPushPromptLoading: false,
        });
        console.error(err);
        return this.props.dispatch(
          addToastWithTimeout(
            'error',
            "Oops, we couldn't enable browser notifications for you. Please try again!"
          )
        );
      });
  };

  dismissWebPushRequest = () => {
    this.setState({
      showWebPushPrompt: false,
    });
  };

  markSingleNotificationSeen = (id: string) => {
    const { markSingleNotificationSeen } = this.props;
    return markSingleNotificationSeen(id).catch(err => {
      // ignore errors for now
    });
  };

  render() {
    const {
      currentUser,
      data,
      isLoading,
      hasError,
      isFetchingMore,
    } = this.props;

    const { title, description } = generateMetaInfo({
      type: 'notifications',
    });

    if (data.notifications && data.notifications.edges.length > 0) {
      let notifications = data.notifications.edges
        .map(notification => parseNotification(notification.node))
        .filter(
          notification => notification.context.type !== 'DIRECT_MESSAGE_THREAD'
        );

      notifications = deduplicateChildren(notifications, 'id');
      notifications = sortByDate(notifications, 'modifiedAt', 'desc');
      return (
        <React.Fragment>
          <Head title={title} description={description} />
          <ViewGrid>
            <StyledSingleColumn>
              <div>
                <StickyHeader>
                  {!isDesktopApp() && this.state.showWebPushPrompt && (
                    <OutlineButton
                      onClick={this.subscribeToWebPush}
                      isLoading={this.state.webPushPromptLoading}
                      css={{ marginRight: '16px' }}
                    >
                      {isLoading ? 'Enabling...' : 'Enable push notifications'}
                    </OutlineButton>
                  )}
                  <PrimaryButton
                    disabled={notifications.every(
                      notification => notification.isSeen
                    )}
                    onClick={() => this.markAllNotificationsSeen()}
                  >
                    Mark all seen
                  </PrimaryButton>
                </StickyHeader>
                {notifications.map(notification => {
                  switch (notification.event) {
                    case 'MESSAGE_CREATED': {
                      return (
                        <ErrorBoundary key={notification.id}>
                          <NewMessageNotification
                            notification={notification}
                            currentUser={currentUser}
                            markSingleNotificationSeen={
                              this.markSingleNotificationSeen
                            }
                          />
                        </ErrorBoundary>
                      );
                    }
                    case 'REACTION_CREATED': {
                      return (
                        <ErrorBoundary key={notification.id}>
                          <NewReactionNotification
                            notification={notification}
                            currentUser={currentUser}
                            markSingleNotificationSeen={
                              this.markSingleNotificationSeen
                            }
                          />
                        </ErrorBoundary>
                      );
                    }
                    case 'THREAD_REACTION_CREATED': {
                      return (
                        <ErrorBoundary key={notification.id}>
                          <NewThreadReactionNotification
                            notification={notification}
                            currentUser={currentUser}
                            markSingleNotificationSeen={
                              this.markSingleNotificationSeen
                            }
                          />
                        </ErrorBoundary>
                      );
                    }
                    case 'CHANNEL_CREATED': {
                      return (
                        <ErrorBoundary key={notification.id}>
                          <NewChannelNotification
                            notification={notification}
                            currentUser={currentUser}
                            markSingleNotificationSeen={
                              this.markSingleNotificationSeen
                            }
                          />
                        </ErrorBoundary>
                      );
                    }
                    case 'USER_JOINED_COMMUNITY': {
                      return (
                        <ErrorBoundary key={notification.id}>
                          <NewUserInCommunityNotification
                            notification={notification}
                            currentUser={currentUser}
                            markSingleNotificationSeen={
                              this.markSingleNotificationSeen
                            }
                          />
                        </ErrorBoundary>
                      );
                    }
                    case 'THREAD_CREATED': {
                      // deprecated - we no longer show this notification type in-app
                      return null;
                    }
                    case 'COMMUNITY_INVITE': {
                      return (
                        <ErrorBoundary key={notification.id}>
                          <CommunityInviteNotification
                            notification={notification}
                            currentUser={currentUser}
                            markSingleNotificationSeen={
                              this.markSingleNotificationSeen
                            }
                          />
                        </ErrorBoundary>
                      );
                    }
                    case 'MENTION_MESSAGE': {
                      return (
                        <ErrorBoundary key={notification.id}>
                          <MentionMessageNotification
                            notification={notification}
                            currentUser={currentUser}
                            markSingleNotificationSeen={
                              this.markSingleNotificationSeen
                            }
                          />
                        </ErrorBoundary>
                      );
                    }
                    case 'MENTION_THREAD': {
                      return (
                        <ErrorBoundary key={notification.id}>
                          <MentionThreadNotification
                            notification={notification}
                            currentUser={currentUser}
                            markSingleNotificationSeen={
                              this.markSingleNotificationSeen
                            }
                          />
                        </ErrorBoundary>
                      );
                    }
                    case 'PRIVATE_CHANNEL_REQUEST_SENT': {
                      return (
                        <ErrorBoundary key={notification.id}>
                          <PrivateChannelRequestSent
                            notification={notification}
                            currentUser={currentUser}
                            markSingleNotificationSeen={
                              this.markSingleNotificationSeen
                            }
                          />
                        </ErrorBoundary>
                      );
                    }
                    case 'PRIVATE_CHANNEL_REQUEST_APPROVED': {
                      return (
                        <ErrorBoundary key={notification.id}>
                          <PrivateChannelRequestApproved
                            notification={notification}
                            currentUser={currentUser}
                            markSingleNotificationSeen={
                              this.markSingleNotificationSeen
                            }
                          />
                        </ErrorBoundary>
                      );
                    }
                    case 'PRIVATE_COMMUNITY_REQUEST_SENT': {
                      return (
                        <ErrorBoundary key={notification.id}>
                          <PrivateCommunityRequestSent
                            notification={notification}
                            currentUser={currentUser}
                            markSingleNotificationSeen={
                              this.markSingleNotificationSeen
                            }
                          />
                        </ErrorBoundary>
                      );
                    }
                    case 'PRIVATE_COMMUNITY_REQUEST_APPROVED': {
                      return (
                        <ErrorBoundary key={notification.id}>
                          <PrivateCommunityRequestApproved
                            notification={notification}
                            currentUser={currentUser}
                            markSingleNotificationSeen={
                              this.markSingleNotificationSeen
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

                {data.hasNextPage && (
                  <NextPageButton
                    isFetchingMore={isFetchingMore}
                    fetchMore={data.fetchMore}
                    bottomOffset={-100}
                  >
                    Load more notifications
                  </NextPageButton>
                )}
              </div>
            </StyledSingleColumn>
          </ViewGrid>
        </React.Fragment>
      );
    }

    if (isLoading) {
      return <LoadingView />;
    }

    if (hasError) {
      return <ErrorView />;
    }

    // no issues loading, but the user doesnt have notifications yet
    return (
      <ErrorView
        emoji="😙"
        heading="No notifications...yet"
        subheading="Looks like you’re new around here! When you start receiving notifications about conversations on Spectrum, they'll show up here."
      />
    );
  }
}

const map = state => ({
  networkOnline: state.connectionStatus.networkOnline,
  websocketConnection: state.connectionStatus.websocketConnection,
});

export default compose(
  subscribeToWebPush,
  getNotifications,
  markNotificationsSeenMutation,
  markSingleNotificationSeenMutation,
  viewNetworkHandler,
  withCurrentUser,
  // $FlowIssue
  connect(map)
)(NotificationsPure);
