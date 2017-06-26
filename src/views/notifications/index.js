//@flow
import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
import { withInfiniteScroll } from '../../components/infiniteScroll';
import { parseNotification, getDistinctNotifications } from './utils';
import { NewMessageNotification } from './components/newMessageNotification';
import { NewReactionNotification } from './components/newReactionNotification';
import { NewChannelNotification } from './components/newChannelNotification';
import { NewThreadNotification } from './components/newThreadNotification';
import {
  CommunityInviteNotification,
} from './components/communityInviteNotification';
import {
  NewUserInCommunityNotification,
} from './components/newUserInCommunityNotification';
import { Column } from '../../components/column';
import AppViewWrapper from '../../components/appViewWrapper';
import Titlebar from '../../views/titlebar';
import { displayLoadingNotifications } from '../../components/loading';
import { FetchMoreButton } from '../../components/threadFeed/style';
import { FlexCol } from '../../components/globals';
import { sortByDate } from '../../helpers/utils';
import {
  getNotifications,
  markNotificationsSeenMutation,
} from '../../api/notification';
import {
  UpsellSignIn,
  UpsellToReload,
  UpsellNullNotifications,
} from '../../components/upsell';

class NotificationsPure extends Component {
  state: {
    isFetching: boolean,
  };

  constructor() {
    super();

    this.state = {
      isFetching: false,
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
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        isFetching: false,
      });
    }
  }

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

    const { notifications: { pageInfo: { hasNextPage } } } = data;

    if (!notifications || notifications.length === 0) {
      return (
        <AppViewWrapper>
          <Column type={'primary'}>
            <UpsellNullNotifications />
          </Column>
        </AppViewWrapper>
      );
    }

    return (
      <FlexCol style={{ flex: '1 1 auto' }}>
        <Titlebar title={'Notifications'} provideBack={false} noComposer />
        <AppViewWrapper>
          <Column type={'primary'}>
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

            {hasNextPage &&
              <div>
                <FetchMoreButton
                  color={'brand.default'}
                  loading={this.state.isFetching}
                  onClick={this.fetchMore}
                >
                  Load more notifications
                </FetchMoreButton>
              </div>}
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
  getNotifications,
  displayLoadingNotifications,
  markNotificationsSeenMutation,
  connect(mapStateToProps),
  withInfiniteScroll,
  pure
)(NotificationsPure);
