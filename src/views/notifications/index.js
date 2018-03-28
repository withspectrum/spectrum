// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
// NOTE(@mxstbr): This is a custom fork published of off this (as of this writing) unmerged PR: https://github.com/CassetteRocks/react-infinite-scroller/pull/38
// I literally took it, renamed the package.json and published to add support for scrollElement since our scrollable container is further outside
import InfiniteList from 'react-infinite-scroller-with-scroll-element';
import { withInfiniteScroll } from '../../components/infiniteScroll';
import { parseNotification, getDistinctNotifications } from './utils';
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
import { track } from '../../helpers/events';
import { addToastWithTimeout } from '../../actions/toasts';
import getNotifications from 'shared/graphql/queries/notification/getNotifications';
import markNotificationsSeenMutation from 'shared/graphql/mutations/notification/markNotificationsSeen';
import { subscribeToWebPush } from 'shared/graphql/subscriptions';
import { UpsellSignIn, UpsellNullNotifications } from '../../components/upsell';
import ViewError from '../../components/viewError';
import BrowserNotificationRequest from './components/browserNotificationRequest';
import generateMetaInfo from 'shared/generate-meta-info';

type Props = {
  markAllNotificationsSeen?: Function,
  subscribeToWebPush: Function,
  dispatch: Function,
  currentUser: Object,
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
    this.markAllNotificationsSeen();
    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      scrollElement: document.getElementById('scroller-for-thread-feed'),
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
            if (!subscription) track('browser push notifications', 'prompted');
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
    track('browser push notifications', 'prompt triggered');
    this.setState({
      webPushPromptLoading: true,
    });
    WebPushManager.subscribe()
      .then(subscription => {
        track('browser push notifications', 'subscribed');
        this.setState({
          webPushPromptLoading: false,
          showWebPushPrompt: false,
        });
        return this.props.subscribeToWebPush(subscription);
      })
      .catch(err => {
        track('browser push notifications', 'blocked');
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
    track('browser push notifications', 'dismissed');
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

    notifications = getDistinctNotifications(notifications);
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
              hasMore={data.hasNextPage}
              loader={<LoadingThread />}
              useWindow={false}
              initialLoad={false}
              scrollElement={scrollElement}
              threshold={750}
            >
              {notifications.map(notification => {
                switch (notification.event) {
                  case 'MESSAGE_CREATED': {
                    return (
                      <NewMessageNotification
                        key={notification.id}
                        notification={notification}
                        currentUser={currentUser}
                      />
                    );
                  }
                  case 'REACTION_CREATED': {
                    return (
                      <NewReactionNotification
                        key={notification.id}
                        notification={notification}
                        currentUser={currentUser}
                      />
                    );
                  }
                  case 'CHANNEL_CREATED': {
                    return (
                      <NewChannelNotification
                        key={notification.id}
                        notification={notification}
                        currentUser={currentUser}
                      />
                    );
                  }
                  case 'USER_JOINED_COMMUNITY': {
                    return (
                      <NewUserInCommunityNotification
                        key={notification.id}
                        notification={notification}
                        currentUser={currentUser}
                      />
                    );
                  }
                  case 'THREAD_CREATED': {
                    return (
                      <NewThreadNotification
                        key={notification.id}
                        notification={notification}
                        currentUser={currentUser}
                      />
                    );
                  }
                  case 'COMMUNITY_INVITE': {
                    return (
                      <CommunityInviteNotification
                        key={notification.id}
                        notification={notification}
                        currentUser={currentUser}
                      />
                    );
                  }
                  case 'MENTION_MESSAGE': {
                    return (
                      <MentionMessageNotification
                        key={notification.id}
                        notification={notification}
                        currentUser={currentUser}
                      />
                    );
                  }
                  case 'MENTION_THREAD': {
                    return (
                      <MentionThreadNotification
                        key={notification.id}
                        notification={notification}
                        currentUser={currentUser}
                      />
                    );
                  }
                  case 'PRIVATE_CHANNEL_REQUEST_SENT': {
                    return (
                      <PrivateChannelRequestSent
                        key={notification.id}
                        notification={notification}
                        currentUser={currentUser}
                      />
                    );
                  }
                  case 'PRIVATE_CHANNEL_REQUEST_APPROVED': {
                    return (
                      <PrivateChannelRequestApproved
                        key={notification.id}
                        notification={notification}
                        currentUser={currentUser}
                      />
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
  withInfiniteScroll
)(NotificationsPure);
