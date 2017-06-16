// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
import compose from 'recompose/compose';
import { getCurrentUserProfile } from '../../api/user';
import {
  getNotificationsForNavbar,
  markNotificationsSeenMutation,
  markSingleNotificationSeenMutation,
  markNotificationsReadMutation,
  markDirectMessageNotificationsSeenMutation,
} from '../../api/notification';
import { SERVER_URL } from '../../api';
import Icon from '../../components/icons';
import { displayLoadingNavbar } from '../../components/loading';
import { Button } from '../../components/buttons';
import { NotificationDropdown } from './components/notificationDropdown';
import { ProfileDropdown } from './components/profileDropdown';
import Head from '../../components/head';
import { getDistinctNotifications } from '../../views/notifications/utils';
import {
  saveUserDataToLocalStorage,
  logout,
} from '../../actions/authentication';
import {
  Section,
  Nav,
  LogoLink,
  Logo,
  IconDrop,
  IconLink,
  Label,
  LabelForTab,
  UserProfileAvatar,
  UnseenCount,
  DmUnseenCount,
} from './style';

class Navbar extends Component {
  state: {
    allUnseenCount: number,
    dmUnseenCount: number,
    notifications: Array<Object>,
    subscription: ?Function,
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.calculateUnseenCounts(),
      subscription: null,
    };
  }

  calculateUnseenCounts = props => {
    const { data: { user }, notificationsQuery, match } = props || this.props;
    const currentUser = user;
    let notifications =
      currentUser &&
      notificationsQuery.notifications.edges.map(
        notification => notification.node
      );

    notifications = getDistinctNotifications(notifications);

    /*
      NOTE:
      This is hacky, but by getting the string after the last slash in the current url, we can compare it against in the incoming notifications in order to not show a new notification bubble on views the user is already looking at. This only applies to /messages/:threadId or /thread/:id - by matching this url param with the incoming notification.context.id we can determine whether or not to increment the count.
    */
    const id = match.url.substr(match.url.lastIndexOf('/') + 1);

    const dmUnseenCount =
      notifications &&
      notifications.length > 0 &&
      notifications
        .filter(notification => notification.isSeen === false)
        .filter(notification => {
          // SEE NOTE ABOVE
          if (notification.context.id !== id) return notification;
          // if the notification context matches the current route, go ahead and mark it as seen
          this.props.markSingleNotificationSeen(notification.id);
        })
        .filter(
          notification => notification.context.type === 'DIRECT_MESSAGE_THREAD'
        ).length;

    const allUnseenCount =
      notifications &&
      notifications.length > 0 &&
      notifications
        .filter(notification => notification.isSeen === false)
        .filter(notification => {
          // SEE NOTE ABOVE
          if (notification.context.id !== id) return notification;
          // if the notification context matches the current route, go ahead and mark it as seen
          this.props.markSingleNotificationSeen(notification.id);
        })
        .filter(
          notification => notification.context.type !== 'DIRECT_MESSAGE_THREAD'
        ).length;

    return {
      allUnseenCount,
      dmUnseenCount,
      notifications,
    };
  };

  formattedCount = count => {
    if (count > 10) {
      return '10+';
    } else if (count > 0) {
      return count;
    } else return false;
  };

  componentDidMount() {
    const { data: { user }, dispatch, history, match } = this.props;
    const currentUser = user;

    if (currentUser && currentUser !== null) {
      dispatch(saveUserDataToLocalStorage(user));

      // if the user lands on /home, it means they just logged in. If this code
      // runs, we know a user was returned successfully and set to localStorage,
      // so we can redirect to the root url
      if (match.url === '/home') {
        history.push('/');
      }
      this.subscribe();
    }
  }

  componentDidUpdate(prevProps) {
    const { match } = this.props;
    if (!this.props.data.user) return;
    if (!this.props.notificationsQuery) return;
    if (!prevProps.notificationsQuery) {
      this.setState(this.calculateUnseenCounts());
      return;
    }

    if (
      prevProps.notificationsQuery.notifications.edges.length !==
      this.props.notificationsQuery.notifications.edges.length
    ) {
      this.setState(this.calculateUnseenCounts());
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  subscribe = () => {
    this.setState({
      subscription: this.props.subscribeToNewNotifications(),
    });
  };

  unsubscribe = () => {
    const { subscription } = this.state;
    if (subscription) {
      // This unsubscribes the subscription
      subscription();
    }
  };

  markAllNotificationsSeen = () => {
    const { allUnseenCount } = this.state;

    if (allUnseenCount === 0) {
      return null;
    } else {
      this.setState({
        allUnseenCount: 0,
      });
      this.props
        .markAllNotificationsSeen()
        .then(({ data: { markAllNotificationsSeen } }) => {
          // notifs were marked as seen
        })
        .catch(err => {
          // error
        });
    }
  };

  markAllNotificationsRead = () => {
    this.props
      .markAllNotificationsRead()
      .then(({ data: { markAllNotificationsRead } }) => {
        // notifs were marked as read
      })
      .catch(err => {
        // error
      });
  };

  markDmNotificationsAsSeen = () => {
    const { dmUnseenCount } = this.state;

    if (dmUnseenCount === 0) {
      return null;
    } else {
      this.setState({
        dmUnseenCount: 0,
      });
      this.props
        .markDirectMessageNotificationsSeen()
        .then(({ data: { markAllUserDirectMessageNotificationsRead } }) => {
          // notifs were marked as seen
        })
        .catch(err => {
          // err
        });
    }
    if (this.interval) {
      clearInterval(this.interval);
    }
  };

  logout = () => {
    if (this.interval) {
      clearInterval(this.interval);
    }
    logout();
  };

  login = () => {
    // log the user in and return them to this page
    return (window.location.href = `${SERVER_URL}/auth/twitter?r=${window.location.href}`);
  };

  render() {
    const { match, data: { user } } = this.props;
    const currentUser = user;
    const { allUnseenCount, dmUnseenCount, notifications } = this.state;

    if (!currentUser || currentUser === null) {
      return (
        <Nav>
          <Section left hideOnMobile>
            <LogoLink to="/">
              <Logo src="/img/mark-white.png" role="presentation" />
            </LogoLink>
          </Section>
          <Section right>
            <Button onClick={this.login} icon="twitter">
              Sign in
            </Button>
          </Section>
        </Nav>
      );
    } else {
      const showUnreadFavicon = dmUnseenCount > 0 || allUnseenCount > 0;
      return (
        <Nav>
          <Head showUnreadFavicon={showUnreadFavicon} />
          <Section left hideOnMobile>
            <LogoLink to="/">
              <Logo src="/img/mark-white.png" role="presentation" />
            </LogoLink>

            <IconLink data-active={match.url === '/' && match.isExact} to="/">
              <Icon glyph="home" />
              <Label>Home</Label>
            </IconLink>

            <IconLink
              data-active={match.url.includes('/messages')}
              to="/messages"
              onClick={this.markDmNotificationsAsSeen}
              withCount={this.formattedCount(dmUnseenCount)}
            >
              <Icon glyph={dmUnseenCount > 0 ? 'message-fill' : 'message'} />
              <Label>Messages</Label>
            </IconLink>

            <IconLink data-active={match.url === '/explore'} to="/explore">
              <Icon glyph="explore" />
              <Label>Explore</Label>
            </IconLink>
          </Section>

          <Section right hideOnMobile>
            <IconDrop onMouseLeave={this.markAllNotificationsSeen}>
              <IconLink
                data-active={match.url === '/notifications'}
                to="/notifications"
                withCount={this.formattedCount(allUnseenCount)}
              >
                <Icon
                  glyph={
                    allUnseenCount > 0 ? 'notification-fill' : 'notification'
                  }
                />
              </IconLink>
              <NotificationDropdown
                rawNotifications={notifications}
                markAllRead={this.markAllNotificationsRead}
                currentUser={currentUser}
                width={'480px'}
              />
            </IconDrop>

            <IconDrop>
              <IconLink
                data-active={match.url === `/users/${currentUser.username}`}
                to={`/users/${currentUser.username}`}
              >
                <UserProfileAvatar
                  src={`${currentUser.profilePhoto}`}
                  isPro={currentUser.isPro}
                />
              </IconLink>
              <ProfileDropdown logout={this.logout} user={currentUser} />
            </IconDrop>
          </Section>
          <Section hideOnDesktop>
            <IconLink data-active={match.url === '/' && match.isExact} to="/">
              <Icon glyph="home" />
              <Label>Home</Label>
            </IconLink>

            <IconLink
              data-active={match.url.includes('/messages')}
              to="/messages"
              onClick={this.markDmNotificationsAsSeen}
              withCount={this.formattedCount(dmUnseenCount)}
            >
              <Icon glyph={dmUnseenCount > 0 ? 'message-fill' : 'message'} />

              <Label>Messages</Label>
            </IconLink>
            <IconLink
              data-active={match.url === '/notifications'}
              to="/notifications"
              withCount={this.formattedCount(allUnseenCount)}
            >
              <Icon
                glyph={
                  allUnseenCount > 0 ? 'notification-fill' : 'notification'
                }
              />
              <Label>Notifications</Label>
            </IconLink>

            <IconLink data-active={match.url === '/explore'} to="/explore">
              <Icon glyph="explore" />
              <Label>Explore</Label>
            </IconLink>

            <IconLink
              data-active={match.url === `/users/${currentUser.username}`}
              to={`/users/${currentUser.username}`}
            >
              <Icon glyph="profile" />
              <Label>Profile</Label>
            </IconLink>
          </Section>
        </Nav>
      );
    }
  }
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default compose(
  getCurrentUserProfile,
  getNotificationsForNavbar,
  markSingleNotificationSeenMutation,
  markNotificationsSeenMutation,
  markNotificationsReadMutation,
  markDirectMessageNotificationsSeenMutation,
  withRouter,
  displayLoadingNavbar,
  connect(mapStateToProps)
)(Navbar);
