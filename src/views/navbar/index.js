import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import queryString from 'query-string';
// $FlowFixMe
import { withApollo } from 'react-apollo';
import { getCurrentUserProfile, editUserMutation } from '../../api/user';
import { openModal } from '../../actions/modals';
import {
  getNotificationsForNavbar,
  markNotificationsSeenMutation,
  MARK_SINGLE_NOTIFICATION_SEEN_MUTATION,
  markNotificationsReadMutation,
  markDirectMessageNotificationsSeenMutation,
} from '../../api/notification';
import Icon from '../../components/icons';
import { Loading } from '../../components/loading';
import { NotificationDropdown } from './components/notificationDropdown';
import { ProfileDropdown } from './components/profileDropdown';
import Head from '../../components/head';
import { getDistinctNotifications } from '../../views/notifications/utils';
import { throttle } from '../../helpers/utils';
import {
  saveUserDataToLocalStorage,
  logout,
} from '../../actions/authentication';
import { removeItemFromStorage } from '../../helpers/localStorage';
import NewUserOnboarding from '../../views/newUserOnboarding';
import {
  Section,
  Nav,
  LogoLink,
  Logo,
  IconDrop,
  IconLink,
  Label,
  UserProfileAvatar,
} from './style';

class Navbar extends Component {
  state: {
    allUnseenCount: number,
    dmUnseenCount: number,
    notifications: Array<Object>,
    subscription: ?Function,
    showNewUserOnboarding: boolean,
  };

  constructor(props) {
    super(props);
    this.state = {
      allUnseenCount: 0,
      dmUnseenCount: 0,
      notifications: [],
      subscription: null,
      showNewUserOnboarding: false,
    };

    this.markAllNotificationsSeen = throttle(
      this.markAllNotificationsSeen,
      5000
    );
  }

  calculateUnseenCounts = () => {
    const {
      data: { user },
      notificationsQuery: { networkStatus },
      notificationsQuery,
      currentUser,
      history,
      activeInboxThread,
    } = this.props;
    const loggedInUser = user || currentUser;

    if (networkStatus === 7) {
      let notifications =
        loggedInUser &&
        notificationsQuery.notifications.edges.map(
          notification => notification.node
        );
      notifications = getDistinctNotifications(notifications);

      /*
        NOTE:
        This is hacky, but by getting the string after the last slash in the current url, we can compare it against in the incoming notifications in order to not show a new notification bubble on views the user is already looking at. This only applies to /messages/:threadId or /thread/:id - by matching this url param with the incoming notification.context.id we can determine whether or not to increment the count.
      */
      const pathname = window.location.pathname;
      const lastIndex = pathname.lastIndexOf('/');
      const firstIndex = pathname.indexOf('/');
      const route = pathname.substr(firstIndex + 1, lastIndex - 1);
      const isMessages = route && route === 'messages';
      const id = pathname.substr(lastIndex + 1);
      const params = queryString.parse(history.location.search);
      const threadParam = params.thread;

      const dmUnseenCount =
        notifications &&
        notifications.length > 0 &&
        notifications
          .filter(notification => notification.isSeen === false)
          .filter(notification => {
            // SEE NOTE ABOVE
            if (notification.context.id === id || isMessages) {
              // if the notification context matches the current route, go ahead and mark it as seen
              this.props.client.mutate({
                mutation: MARK_SINGLE_NOTIFICATION_SEEN_MUTATION,
                variables: {
                  id: notification.id,
                },
              });

              return null;
            }

            return notification;
          })
          .filter(
            notification =>
              notification.context.type === 'DIRECT_MESSAGE_THREAD'
          ).length;

      const allUnseenCount =
        notifications &&
        notifications.length > 0 &&
        notifications
          .filter(notification => notification.isSeen === false)
          .filter(notification => {
            // SEE NOTE ABOVE
            if (
              notification.context.id === activeInboxThread ||
              notification.context.id === threadParam ||
              notification.context.id === id
            ) {
              // if the notification context matches the current route, go ahead and mark it as seen
              this.props.client.mutate({
                mutation: MARK_SINGLE_NOTIFICATION_SEEN_MUTATION,
                variables: {
                  id: notification.id,
                },
              });

              return null;
            }

            return notification;
          })
          .filter(
            notification =>
              notification.context.type !== 'DIRECT_MESSAGE_THREAD'
          ).length;

      return {
        allUnseenCount,
        dmUnseenCount,
        notifications,
      };
    } else {
      return;
    }
  };

  formattedCount = count => {
    if (count > 10) {
      return '10+';
    } else if (count > 0) {
      return count;
    } else return false;
  };

  componentDidUpdate(prevProps) {
    // if the query returned notifications
    if (
      this.props.notificationsQuery.notifications &&
      !prevProps.notificationsQuery.notifications
    ) {
      this.setState(this.calculateUnseenCounts());
    }

    // listen for incoming changes and recalculate notifications count
    if (
      prevProps.notificationsQuery.notifications &&
      prevProps.notificationsQuery.notifications.edges.length !==
        this.props.notificationsQuery.notifications.edges.length
    ) {
      this.setState(this.calculateUnseenCounts());
    }

    const { data: { user }, dispatch, history, match } = this.props;

    // if no user was found, escape
    if (!user) {
      // clear localstorage first
      return removeItemFromStorage('spectrum');
    }

    if (prevProps.data.user !== user && user !== null) {
      if (!user.timezone) {
        this.props.editUser({ timezone: new Date().getTimezoneOffset() * -1 });
      }

      dispatch(saveUserDataToLocalStorage(user));

      // if the user doesn't have a username or they haven't joined any
      // communities, we hide the nav to make room for the fullscreen onboarding
      // flow
      if (!user.username) {
        this.setState({
          showNewUserOnboarding: true,
        });
      }

      // if the user lands on /home, it means they just logged in. If this code
      // runs, we know a user was returned successfully and set to localStorage,
      // so we can redirect to the root url
      if (match.url === '/home') {
        history.push('/');
      }
      this.subscribe();
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
          this.setState({
            allUnseenCount: 0,
          });
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
    this.props.dispatch(openModal('LOGIN'));
  };

  closeNewUserOnboarding = () => {
    return this.setState({
      showNewUserOnboarding: false,
    });
  };

  render() {
    const {
      history,
      match,
      data: { user, networkStatus },
      currentUser,
    } = this.props;
    const loggedInUser = user || currentUser;
    const isMobile = window.innerWidth < 768;
    const currentUserExists =
      loggedInUser !== null && loggedInUser !== undefined;
    const isHome =
      history.location.pathname === '/' ||
      history.location.pathname === '/home';
    const {
      allUnseenCount,
      dmUnseenCount,
      notifications,
      showNewUserOnboarding,
    } = this.state;

    // Bail out if the splash page is showing
    if (!currentUserExists && isHome) return null;

    // if the user is mobile and is viewing a thread or DM thread, don't
    // render a navbar - it will be replaced with a chat input
    const params = queryString.parse(history.location.search);
    const threadParam = params.thread;
    const parts = history.location.pathname.split('/');
    const isViewingThread = parts[1] === 'thread';
    const isViewingDm =
      parts[1] === 'messages' && parts[2] && parts[2] !== 'new';
    const isComposingDm = history.location.pathname === '/messages/new';
    const isComposingThread = history.location.pathname === '/new/thread';
    const isViewingThreadSlider = threadParam !== undefined;
    if (
      isMobile &&
      (isViewingThreadSlider ||
        isComposingDm ||
        isViewingThread ||
        isViewingDm ||
        isComposingThread)
    ) {
      return null;
    }

    // this only shows if the user does not have a username
    if (
      (user && showNewUserOnboarding) ||
      ((history.location.pathname === '/' ||
        history.location.pathname === '/home') &&
        user &&
        user.communityConnection.edges.length === 0)
    ) {
      return (
        <NewUserOnboarding
          close={this.closeNewUserOnboarding}
          currentUser={user}
          // if the user doesn't have a username, they can't close
          // the onboarding
          noCloseButton
        />
      );
    }

    if (networkStatus < 8 && currentUserExists) {
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
              data-active={history.location.pathname.includes('/messages')}
              to="/messages"
              rel="nofollow"
              onClick={this.markDmNotificationsAsSeen}
            >
              <Icon
                glyph={dmUnseenCount > 0 ? 'message-fill' : 'message'}
                withCount={this.formattedCount(dmUnseenCount)}
              />
              <Label>Messages</Label>
            </IconLink>

            <IconLink
              data-active={history.location.pathname === '/explore'}
              to="/explore"
            >
              <Icon glyph="explore" />
              <Label>Explore</Label>
            </IconLink>
          </Section>

          <Section right hideOnMobile>
            <IconDrop
              onMouseEnter={this.markAllNotificationsSeen}
              onClick={this.markAllNotificationsSeen}
            >
              <IconLink
                data-active={history.location.pathname === '/notifications'}
                to="/notifications"
                rel="nofollow"
              >
                <Icon
                  glyph={
                    allUnseenCount > 0 ? 'notification-fill' : 'notification'
                  }
                  withCount={this.formattedCount(allUnseenCount)}
                />
              </IconLink>
              <NotificationDropdown
                rawNotifications={notifications}
                markAllRead={this.markAllNotificationsRead}
                currentUser={loggedInUser}
                width={'480px'}
                loading={networkStatus < 7}
                error={networkStatus === 8}
              />
            </IconDrop>

            <IconDrop>
              <IconLink
                data-active={
                  history.location.pathname ===
                  `/users/${loggedInUser.username}`
                }
                to={
                  loggedInUser.username
                    ? `/users/${loggedInUser.username}`
                    : '/'
                }
              >
                <UserProfileAvatar
                  src={`${loggedInUser.profilePhoto}`}
                  isPro={loggedInUser.isPro}
                />
              </IconLink>
              <ProfileDropdown logout={this.logout} user={loggedInUser} />
            </IconDrop>
          </Section>
          <Section hideOnDesktop>
            <IconLink data-active={match.url === '/' && match.isExact} to="/">
              <Icon glyph="home" />
              <Label>Home</Label>
            </IconLink>

            <IconLink
              data-active={history.location.pathname.includes('/messages')}
              to="/messages"
              rel="nofollow"
              onClick={this.markDmNotificationsAsSeen}
            >
              <Icon
                glyph={dmUnseenCount > 0 ? 'message-fill' : 'message'}
                withCount={this.formattedCount(dmUnseenCount)}
              />

              <Label>Messages</Label>
            </IconLink>
            <IconLink
              data-active={history.location.pathname === '/notifications'}
              to="/notifications"
              rel="nofollow"
              onClick={this.markAllNotificationsSeen}
            >
              <Icon
                glyph={
                  allUnseenCount > 0 ? 'notification-fill' : 'notification'
                }
                withCount={this.formattedCount(allUnseenCount)}
              />
              <Label>Notifications</Label>
            </IconLink>

            <IconLink
              data-active={history.location.pathname === '/explore'}
              to="/explore"
            >
              <Icon glyph="explore" />
              <Label>Explore</Label>
            </IconLink>

            <IconLink
              data-active={
                history.location.pathname === `/users/${loggedInUser.username}`
              }
              to={
                loggedInUser.username ? `/users/${loggedInUser.username}` : '/'
              }
            >
              <Icon glyph="profile" />
              <Label>Profile</Label>
            </IconLink>
          </Section>
        </Nav>
      );
    } else if (networkStatus >= 7) {
      return (
        <Nav>
          <Section left hideOnMobile>
            <LogoLink to="/">
              <Logo src="/img/mark-white.png" role="presentation" />
            </LogoLink>
          </Section>
          <Section right>
            <IconLink data-active={match.url === '/explore'} to="/explore">
              <Icon glyph="explore" />
              <Label>Explore Communities on Spectrum</Label>
            </IconLink>
          </Section>
        </Nav>
      );
    } else {
      return (
        <Nav>
          {isMobile || (
            <LogoLink to="/">
              <Logo src="/img/mark-white.png" role="presentation" />
            </LogoLink>
          )}
          <Loading size={'20'} color={'bg.default'} />
        </Nav>
      );
    }
  }
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
  activeInboxThread: state.dashboardFeed.activeThread,
});
export default compose(
  getCurrentUserProfile,
  getNotificationsForNavbar,
  editUserMutation,
  markNotificationsSeenMutation,
  markNotificationsReadMutation,
  markDirectMessageNotificationsSeenMutation,
  withApollo,
  connect(mapStateToProps)
)(Navbar);
