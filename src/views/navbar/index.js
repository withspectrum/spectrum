// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import queryString from 'query-string';
import Icon from '../../components/icons';
import { ProfileDropdown } from './components/profileDropdown';
import MessagesTab from './components/messagesTab';
import NotificationsTab from './components/notificationsTab';
import Head from '../../components/head';
import {
  Nav,
  Logo,
  HomeTab,
  ExploreTab,
  ProfileDrop,
  ProfileTab,
  SupportTab,
  PricingTab,
  Tab,
  Label,
  Navatar,
} from './style';

type Props = {
  isLoading: boolean,
  hasError: boolean,
  location: Object,
  history: Object,
  match: Object,
  notificationCounts: {
    notifications: number,
    directMessageNotifications: number,
  },
  currentUser?: Object,
  activeInboxThread: ?string,
};

class Navbar extends React.Component<Props> {
  shouldComponentUpdate(nextProps) {
    const currProps = this.props;

    // if route changes
    if (currProps.location.pathname !== nextProps.location.pathname)
      return true;

    // if route query params change
    if (currProps.location.search !== nextProps.location.search) return true;

    // Had no user, now have user or user changed
    if (nextProps.currentUser !== currProps.currentUser) return true;

    // if the badge counts change
    const thisBadgeSum =
      currProps.notificationCounts.notifications +
      currProps.notificationCounts.directMessageNotifications;
    const prevBadgeSum =
      nextProps.notificationCounts.notifications +
      nextProps.notificationCounts.directMessageNotifications;
    if (thisBadgeSum !== prevBadgeSum) return true;

    // if the user is mobile and is viewing a thread or DM thread, re-render
    // the navbar when they exit the thread
    const { thread: thisThreadParam } = queryString.parse(
      currProps.history.location.search
    );
    const { thread: nextThreadParam } = queryString.parse(
      nextProps.history.location.search
    );
    if (thisThreadParam !== nextThreadParam) return true;

    return false;
  }

  render() {
    const { history, match, currentUser, notificationCounts } = this.props;

    const loggedInUser = currentUser;

    const viewing = history.location.pathname;

    const isHome = viewing === '/' || viewing === '/home';

    const isSplash =
      viewing === '/about' ||
      viewing === '/code-of-conduct' ||
      viewing === '/contact' ||
      viewing === '/pricing' ||
      viewing === '/privacy' ||
      viewing === '/privacy.html' ||
      viewing === '/support' ||
      viewing === '/terms' ||
      viewing === '/terms.html';

    // Bail out if the splash page is showing
    if ((!loggedInUser && isHome) || isSplash) return null;

    // if the user is mobile and is viewing a thread or DM thread, don't
    // render a navbar - it will be replaced with a chat input
    const { thread: threadParam } = queryString.parse(history.location.search);
    const parts = history.location.pathname.split('/');
    const isViewingThread = parts[1] === 'thread';
    const isViewingDm =
      parts[1] === 'messages' && parts[2] && parts[2] !== 'new';
    const isComposingDm = history.location.pathname === '/messages/new';
    const isComposingThread = history.location.pathname === '/new/thread';
    const isViewingThreadSlider = threadParam !== undefined;
    const hideNavOnMobile =
      isViewingThreadSlider ||
      isComposingDm ||
      isViewingThread ||
      isViewingDm ||
      isComposingThread;

    if (loggedInUser) {
      return (
        <Nav hideOnMobile={hideNavOnMobile}>
          <Head>
            {notificationCounts.directMessageNotifications > 0 ||
            notificationCounts.notifications > 0 ? (
              <link
                rel="shortcut icon"
                id="dynamic-favicon"
                // $FlowIssue
                href={`${process.env.PUBLIC_URL}/img/favicon_unread.ico`}
              />
            ) : (
              <link
                rel="shortcut icon"
                id="dynamic-favicon"
                // $FlowIssue
                href={`${process.env.PUBLIC_URL}/img/favicon.ico`}
              />
            )}
          </Head>

          <Logo to="/">
            <Icon glyph="logo" size={28} />
          </Logo>

          <HomeTab data-active={match.url === '/' && match.isExact} to="/">
            <Icon glyph="home" />
            <Label>Home</Label>
          </HomeTab>

          <MessagesTab
            active={history.location.pathname.includes('/messages')}
          />

          <ExploreTab
            data-active={history.location.pathname === '/explore'}
            to="/explore"
          >
            <Icon glyph="explore" />
            <Label>Explore</Label>
          </ExploreTab>

          <NotificationsTab
            location={history.location}
            currentUser={loggedInUser}
            active={history.location.pathname.includes('/notifications')}
          />

          <ProfileDrop>
            <Tab
              className={'hideOnMobile'}
              data-active={
                history.location.pathname === `/users/${loggedInUser.username}`
              }
              to={
                loggedInUser.username ? `/users/${loggedInUser.username}` : '/'
              }
            >
              <Navatar
                user={loggedInUser}
                src={`${loggedInUser.profilePhoto}`}
                size={24}
              />
            </Tab>
            <ProfileDropdown user={loggedInUser} />
          </ProfileDrop>

          <ProfileTab
            className={'hideOnDesktop'}
            data-active={
              history.location.pathname === `/users/${loggedInUser.username}`
            }
            to={loggedInUser.username ? `/users/${loggedInUser.username}` : '/'}
          >
            <Icon glyph="profile" />
            <Label>Profile</Label>
          </ProfileTab>
        </Nav>
      );
    }

    if (!loggedInUser) {
      return (
        <Nav hideOnMobile={hideNavOnMobile} loggedOut={!loggedInUser}>
          <Logo to="/">
            <Icon glyph="logo" size={28} />
          </Logo>
          <HomeTab
            className={'hideOnDesktop'}
            data-active={match.url === '/' && match.isExact}
            to="/"
          >
            <Icon glyph="logo" />
            <Label>About</Label>
          </HomeTab>
          <ExploreTab
            data-active={history.location.pathname === '/explore'}
            to="/explore"
            loggedOut={!loggedInUser}
          >
            <Icon glyph="explore" />
            <Label>Explore</Label>
          </ExploreTab>
          <SupportTab
            data-active={history.location.pathname === '/support'}
            to="/support"
          >
            <Icon glyph="like" />
            <Label>Support</Label>
          </SupportTab>
          <PricingTab
            data-active={history.location.pathname === '/pricing'}
            to="/pricing"
          >
            <Icon glyph="payment" />
            <Label>Pricing</Label>
          </PricingTab>
        </Nav>
      );
    }

    return null;
  }
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
  notificationCounts: state.notifications,
});
export default compose(
  // $FlowIssue
  connect(mapStateToProps)
)(Navbar);
