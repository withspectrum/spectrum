//@flow
import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
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
import { NewUserInCommunityNotification } from './components/newUserInCommunityNotification';
import { Column } from '../../components/column';
import AppViewWrapper from '../../components/appViewWrapper';
import Titlebar from '../../views/titlebar';
import {
  displayLoadingNotifications,
  LoadingThread,
} from '../../components/loading';
import { FlexCol } from '../../components/globals';
import { sortByDate } from '../../helpers/utils';
import {
  storeItem,
  getItemFromStorage,
  removeItemFromStorage,
} from '../../helpers/localStorage';
import WebPushManager from '../../helpers/web-push-manager';
import { track } from '../../helpers/events';
import { addToastWithTimeout } from '../../actions/toasts';
import {
  getNotifications,
  markNotificationsSeenMutation,
} from '../../api/notification';
import { subscribeToWebPush } from '../../api/web-push-subscriptions';
import {
  UpsellSignIn,
  UpsellToReload,
  UpsellNullNotifications,
} from '../../components/upsell';
import BrowserNotificationRequest from './components/browserNotificationRequest';

class NotificationsPure extends Component {
  state: {
    isFetching: boolean,
    showWebPushPrompt: boolean,
  };

  constructor() {
    super();

    this.state = {
      isFetching: false,
      showWebPushPrompt: false,
    };
  }

  markAllNotificationsSeen = () => {
    this.props
      .markAllNotificationsSeen()
      .then(({ data: { markAllNotificationsSeen } }) => {
        // notifs were marked as seen
      })
      .catch(err => {
        // error
      });
  };

  fetchMore = () => {
    this.setState({
      isFetching: true,
    });

    this.props.data.fetchMore();
  };

  componentDidMount() {
    this.markAllNotificationsSeen();
    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      scrollElement: document.getElementById('scroller-for-thread-feed'),
    });

    if (getItemFromStorage('webPushPromptDismissed')) {
      return this.setState({
        showWebPushPrompt: false,
      });
    }

    WebPushManager.getPermissionState().then(result => {
      if (result === 'prompt') {
        track('browser push notifications', 'prompted');
        this.setState({
          showWebPushPrompt: true,
        });
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        isFetching: false,
      });
    }
  }

  subscribeToWebPush = () => {
    track('browser push notifications', 'prompt triggered');
    WebPushManager.subscribe()
      .then(subscription => {
        track('browser push notifications', 'subscribed');
        removeItemFromStorage('webPushPromptDismissed');
        return this.props.subscribeToWebPush(subscription);
      })
      .catch(err => {
        track('browser push notifications', 'blocked');
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
    storeItem('webPushPromptDismissed', { timestamp: Date.now() });
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
          <Column type={'primary'}>
            <UpsellToReload />
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

    if (!notifications || notifications.length === 0) {
      return (
        <AppViewWrapper>
          <Column type={'primary'}>
            {this.state.showWebPushPrompt &&
              <BrowserNotificationRequest
                onSubscribe={this.subscribeToWebPush}
                onDismiss={this.dismissWebPushRequest}
              />}
            <UpsellNullNotifications />
          </Column>
        </AppViewWrapper>
      );
    }

    const { scrollElement } = this.state;

    return (
      <FlexCol style={{ flex: '1 1 auto' }}>
        <Titlebar title={'Notifications'} provideBack={false} noComposer />
        <AppViewWrapper>
          <Column type={'primary'}>
            {this.state.showWebPushPrompt &&
              <BrowserNotificationRequest
                onSubscribe={this.subscribeToWebPush}
                onDismiss={this.dismissWebPushRequest}
              />}
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
  connect(mapStateToProps),
  withInfiniteScroll,
  pure
)(NotificationsPure);
