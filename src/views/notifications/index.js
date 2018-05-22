// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
// NOTE(@mxstbr): This is a custom fork published of off this (as of this writing) unmerged PR: https://github.com/CassetteRocks/react-infinite-scroller/pull/38
// I literally took it, renamed the package.json and published to add support for scrollElement since our scrollable container is further outside
import InfiniteList from 'src/components/infiniteScroll';
import { deduplicateChildren } from 'src/components/infiniteScroll/deduplicateChildren';
import { parseNotification } from './utils';
import { NewMessageNotification } from './components/newMessageNotification';
import { NewReactionNotification } from './components/newReactionNotification';
import { NewChannelNotification } from './components/newChannelNotification';
import { NewThreadNotification } from './components/newThreadNotification';
import { CommunityInviteNotification } from './components/communityInviteNotification';
import { MentionMessageNotification } from './components/mentionMessageNotification';
import { MentionThreadNotification } from './components/mentionThreadNotification';
import { NewUserInCommunityNotification } from './components/newUserInCommunityNotification';
import { PrivateChannelRequestApproved } from './components/privateChannelRequestApprovedNotification';
import { PrivateChannelRequestSent } from './components/privateChannelRequestSentNotification';
import { Column } from '../../components/column';
import AppViewWrapper from '../../components/appViewWrapper';
import Head from '../../components/head';
import Titlebar from '../../views/titlebar';
import {
  displayLoadingNotifications,
  LoadingThread,
} from '../../components/loading';
import { FlexCol } from '../../components/globals';
import { sortByDate } from '../../helpers/utils';
import WebPushManager from '../../helpers/web-push-manager';
import { addToastWithTimeout } from '../../actions/toasts';
import getNotifications from 'shared/graphql/queries/notification/getNotifications';
import markNotificationsSeenMutation from 'shared/graphql/mutations/notification/markNotificationsSeen';
import { subscribeToWebPush } from 'shared/graphql/subscriptions';
import { UpsellSignIn, UpsellNullNotifications } from '../../components/upsell';
import ViewError from '../../components/viewError';
import BrowserNotificationRequest from './components/browserNotificationRequest';
import generateMetaInfo from 'shared/generate-meta-info';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import { track, events } from 'src/helpers/analytics';
import type { Dispatch } from 'redux';
import { ErrorBoundary } from 'src/components/error';

type Props = {
  markAllNotificationsSeen?: Function,
  subscribeToWebPush: Function,
  dispatch: Dispatch<Object>,
  currentUser: Object,
  isFetchingMore: boolean,
  data: {
    networkStatus: number,
    fetchMore: Function,
    hasNextPage: boolean,
    notifications: {
      edges: Array<Object>,
    },
  },
};
type State = {
  showWebPushPrompt: boolean,
  webPushPromptLoading: boolean,
  scrollElement: any,
};

class NotificationsPure extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      showWebPushPrompt: false,
      webPushPromptLoading: false,
      scrollElement: null,
    };
  }

  markAllNotificationsSeen = () => {
    this.props.markAllNotificationsSeen &&
      this.props.markAllNotificationsSeen().catch(err => {
        console.error('Error marking all notifications seen: ', err);
      });
  };

  componentDidMount() {
    const scrollElement = document.getElementById('scroller-for-thread-feed');
    this.markAllNotificationsSeen();
    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      scrollElement,
    });

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
            if (!subscription) {
              track(events.WEB_PUSH_NOTIFICATIONS_PROMPT_VIEWED);
            }
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

  shouldComponentUpdate(nextProps) {
    const curr = this.props;
    // fetching more
    if (curr.data.networkStatus === 7 && nextProps.data.networkStatus === 3)
      return false;
    return true;
  }

  subscribeToWebPush = () => {
    track(events.WEB_PUSH_NOTIFICATIONS_PROMPT_CLICKED);
    this.setState({
      webPushPromptLoading: true,
    });
    WebPushManager.subscribe()
      .then(subscription => {
        track(events.WEB_PUSH_NOTIFICATIONS_SUBSCRIBED);
        this.setState({
          webPushPromptLoading: false,
          showWebPushPrompt: false,
        });
        return this.props.subscribeToWebPush(subscription);
      })
      .catch(err => {
        track(events.WEB_PUSH_NOTIFICATIONS_BLOCKED);
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
    track(events.WEB_PUSH_NOTIFICATIONS_PROMPT_DISMISSED);
  };

  render() {
    const { currentUser, data } = this.props;
    if (!currentUser) {
      return (
        <AppViewWrapper>
          <Column type={'primary'}>
            <UpsellSignIn />
          </Column>
        </AppViewWrapper>
      );
    }

    if (!data || data.error || data.loading) {
      return (
        <AppViewWrapper>
          <ViewError />
        </AppViewWrapper>
      );
    }

    const { title, description } = generateMetaInfo({
      type: 'notifications',
    });

    if (!data.notifications || data.notifications.edges.length === 0) {
      return (
        <AppViewWrapper>
          <Column type={'primary'}>
            <Head title={title} description={description} />
            <UpsellNullNotifications />
          </Column>
        </AppViewWrapper>
      );
    }

    let notifications = data.notifications.edges
      .map(notification => parseNotification(notification.node))
      .filter(
        notification => notification.context.type !== 'DIRECT_MESSAGE_THREAD'
      );

    notifications = deduplicateChildren(notifications, 'id');
    notifications = sortByDate(notifications, 'modifiedAt', 'desc');

    const { scrollElement } = this.state;

    return (
      <FlexCol style={{ flex: '1 1 auto', maxHeight: 'calc(100% - 48px)' }}>
        <Head title={title} description={description} />
        <Titlebar title={'Notifications'} provideBack={false} noComposer />
        <AppViewWrapper>
          <Column type={'primary'}>
            {this.state.showWebPushPrompt && (
              <BrowserNotificationRequest
                onSubscribe={this.subscribeToWebPush}
                onDismiss={this.dismissWebPushRequest}
                loading={this.state.webPushPromptLoading}
              />
            )}
            <InfiniteList
              pageStart={0}
              loadMore={data.fetchMore}
              isLoadingMore={this.props.isFetchingMore}
              hasMore={data.hasNextPage}
              loader={<LoadingThread />}
              useWindow={false}
              initialLoad={false}
              scrollElement={scrollElement}
              threshold={750}
              className={'scroller-for-notifications'}
            >
              {notifications.map(notification => {
                switch (notification.event) {
                  case 'MESSAGE_CREATED': {
                    return (
                      <ErrorBoundary
                        fallbackComponent={null}
                        key={notification.id}
                      >
                        <NewMessageNotification
                          notification={notification}
                          currentUser={currentUser}
                        />
                      </ErrorBoundary>
                    );
                  }
                  case 'REACTION_CREATED': {
                    return (
                      <ErrorBoundary
                        fallbackComponent={null}
                        key={notification.id}
                      >
                        <NewReactionNotification
                          notification={notification}
                          currentUser={currentUser}
                        />
                      </ErrorBoundary>
                    );
                  }
                  case 'CHANNEL_CREATED': {
                    return (
                      <ErrorBoundary
                        fallbackComponent={null}
                        key={notification.id}
                      >
                        <NewChannelNotification
                          notification={notification}
                          currentUser={currentUser}
                        />
                      </ErrorBoundary>
                    );
                  }
                  case 'USER_JOINED_COMMUNITY': {
                    return (
                      <ErrorBoundary
                        fallbackComponent={null}
                        key={notification.id}
                      >
                        <NewUserInCommunityNotification
                          notification={notification}
                          currentUser={currentUser}
                        />
                      </ErrorBoundary>
                    );
                  }
                  case 'THREAD_CREATED': {
                    return (
                      <ErrorBoundary
                        fallbackComponent={null}
                        key={notification.id}
                      >
                        <NewThreadNotification
                          notification={notification}
                          currentUser={currentUser}
                        />
                      </ErrorBoundary>
                    );
                  }
                  case 'COMMUNITY_INVITE': {
                    return (
                      <ErrorBoundary
                        fallbackComponent={null}
                        key={notification.id}
                      >
                        <CommunityInviteNotification
                          notification={notification}
                          currentUser={currentUser}
                        />
                      </ErrorBoundary>
                    );
                  }
                  case 'MENTION_MESSAGE': {
                    return (
                      <ErrorBoundary
                        fallbackComponent={null}
                        key={notification.id}
                      >
                        <MentionMessageNotification
                          notification={notification}
                          currentUser={currentUser}
                        />
                      </ErrorBoundary>
                    );
                  }
                  case 'MENTION_THREAD': {
                    return (
                      <ErrorBoundary
                        fallbackComponent={null}
                        key={notification.id}
                      >
                        <MentionThreadNotification
                          notification={notification}
                          currentUser={currentUser}
                        />
                      </ErrorBoundary>
                    );
                  }
                  case 'PRIVATE_CHANNEL_REQUEST_SENT': {
                    return (
                      <ErrorBoundary
                        fallbackComponent={null}
                        key={notification.id}
                      >
                        <PrivateChannelRequestSent
                          notification={notification}
                          currentUser={currentUser}
                        />
                      </ErrorBoundary>
                    );
                  }
                  case 'PRIVATE_CHANNEL_REQUEST_APPROVED': {
                    return (
                      <ErrorBoundary
                        fallbackComponent={null}
                        key={notification.id}
                      >
                        <PrivateChannelRequestApproved
                          notification={notification}
                          currentUser={currentUser}
                        />
                      </ErrorBoundary>
                    );
                  }
                  default: {
                    return null;
                  }
                }
              })}
            </InfiniteList>
          </Column>
        </AppViewWrapper>
      </FlexCol>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default compose(
  subscribeToWebPush,
  getNotifications,
  displayLoadingNotifications,
  markNotificationsSeenMutation,
  // $FlowIssue
  connect(mapStateToProps),
  viewNetworkHandler
)(NotificationsPure);
