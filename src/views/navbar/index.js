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
  getNotifications,
  markNotificationsSeenMutation,
  markNotificationsReadMutation,
  markDirectMessageNotificationsSeenMutation,
} from '../../api/notification';
import { SERVER_URL } from '../../api';
import Icon from '../../components/icons';
import { displayLoadingNavbar } from '../../components/loading';
import { Button } from '../../components/buttons';
import { NotificationDropdown } from './components/notificationDropdown';
import { ProfileDropdown } from './components/profileDropdown';
import { saveUserDataToLocalStorage } from '../../actions/authentication';
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
  };

  constructor(props) {
    super(props);

    const { data: { user }, notificationsQuery } = this.props;
    const currentUser = user;
    const notifications =
      currentUser &&
      notificationsQuery.notifications.edges.map(
        notification => notification.node
      );

    const dmUnseenCount =
      notifications &&
      notifications.length > 0 &&
      notifications
        .filter(notification => notification.isSeen === false)
        .filter(
          notification => notification.context.type === 'DIRECT_MESSAGE_THREAD'
        ).length;

    const allUnseenCount =
      notifications &&
      notifications.length > 0 &&
      notifications
        .filter(notification => notification.isSeen === false)
        .filter(
          notification => notification.context.type !== 'DIRECT_MESSAGE_THREAD'
        ).length;

    this.state = {
      allUnseenCount,
      dmUnseenCount,
      notifications,
    };
  }

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
    }
  }

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
        .markDirectMessageNotificationsAsSeen()
        .then(({ data: { markAllUserDirectMessageNotificationsRead } }) => {
          // notifs were marked as seen
        })
        .catch(err => {
          // err
        });
    }
  };

  login = () => {
    // log the user in and return them to this page
    return (window.location.href = `${SERVER_URL}/auth/twitter?redirectTo=${window.location.pathname}`);
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
            <Button
              onClick={this.login}
              icon="twitter"
              style={{ padding: '2px 4px' }}
            >
              Sign in
            </Button>
          </Section>
        </Nav>
      );
    } else {
      return (
        <Nav>
          <Section left>
            <LogoLink to="/">
              <Logo src="/img/mark-white.png" role="presentation" />
            </LogoLink>

            <IconLink
              data-active={match.url === '/' && match.isExact}
              data-mobileWidth={'third'}
              to="/"
            >
              <Icon glyph="home" />
              <Label>Home</Label>
            </IconLink>

            <IconLink
              data-active={match.url.includes('/messages')}
              data-mobileWidth={'third'}
              to="/messages"
              onClick={this.markDmNotificationsAsSeen}
            >
              <Icon glyph={dmUnseenCount > 0 ? 'message-fill' : 'message'} />
              {dmUnseenCount > 0
                ? <DmUnseenCount size={dmUnseenCount >= 10 ? 'large' : 'small'}>
                    {dmUnseenCount >= 10 ? '10+' : dmUnseenCount}
                  </DmUnseenCount>
                : null}
              <Label>Messages</Label>
            </IconLink>

            {/* <IconLink
                data-active={match.url === '/explore'}
                data-mobileWidth={'third'}
                to="/explore"
              >
                <Icon glyph="explore" />
                <Label>Explore</Label>
              </IconLink> */}
          </Section>

          <Section right>
            <IconDrop onMouseLeave={this.markAllNotificationsSeen}>
              <IconLink
                data-active={match.url === '/notifications'}
                data-mobileWidth={'half'}
                to="/notifications"
              >
                <Icon
                  glyph={
                    allUnseenCount > 0 ? 'notification-fill' : 'notification'
                  }
                />
                {allUnseenCount > 0
                  ? <UnseenCount
                      size={allUnseenCount >= 10 ? 'large' : 'small'}
                    >
                      {allUnseenCount >= 10 ? '10+' : allUnseenCount}
                    </UnseenCount>
                  : null}
                <LabelForTab>Notifications</LabelForTab>
              </IconLink>
              <NotificationDropdown
                notifications={notifications}
                markAllRead={this.markAllNotificationsRead}
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
                  size="24"
                  radius="12"
                />
                <LabelForTab>Profile</LabelForTab>
              </IconLink>
              <ProfileDropdown user={currentUser} />
            </IconDrop>
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
  getNotifications,
  markNotificationsSeenMutation,
  markNotificationsReadMutation,
  markDirectMessageNotificationsSeenMutation,
  withRouter,
  displayLoadingNavbar,
  connect(mapStateToProps)
)(Navbar);
