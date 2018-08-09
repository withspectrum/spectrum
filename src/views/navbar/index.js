// @flow
import React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import queryString from 'query-string';
import Icon from '../../components/icons';
import ProfileDropdown from './components/profileDropdown';
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
  SkipLink,
  SigninLink,
} from './style';
import { track, events } from 'src/helpers/analytics';
import { isViewingMarketingPage } from 'src/helpers/is-viewing-marketing-page';
import { isDesktopApp } from 'src/helpers/is-desktop-app';

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

type State = {
  isSkipLinkFocused: boolean,
};

class Navbar extends React.Component<Props, State> {
  state = {
    isSkipLinkFocused: false,
  };

  shouldComponentUpdate(nextProps, nextState) {
    const currProps = this.props;

    // If the update was caused by the focus on the skip link
    if (nextState.isSkipLinkFocused !== this.state.isSkipLinkFocused)
      return true;

    // if route changes
    if (currProps.location.pathname !== nextProps.location.pathname)
      return true;

    // if route query params change
    if (currProps.location.search !== nextProps.location.search) return true;

    // Had no user, now have user or user changed
    if (nextProps.currentUser !== currProps.currentUser) return true;

    const newDMNotifications =
      currProps.notificationCounts.directMessageNotifications !==
      nextProps.notificationCounts.directMessageNotifications;
    const newNotifications =
      currProps.notificationCounts.notifications !==
      nextProps.notificationCounts.notifications;
    if (newDMNotifications || newNotifications) return true;

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

  handleSkipLinkFocus = () => this.setState({ isSkipLinkFocused: true });
  handleSkipLinkBlur = () => this.setState({ isSkipLinkFocused: false });

  getTabProps(isActive: boolean) {
    return {
      'data-active': isActive,
      'aria-current': isActive ? 'page' : undefined,
    };
  }

  trackNavigationClick = (route: string) => {
    switch (route) {
      case 'logo':
        return track(events.NAVIGATION_LOGO_CLICKED);
      case 'home':
        return track(events.NAVIGATION_HOME_CLICKED);
      case 'explore':
        return track(events.NAVIGATION_EXPLORE_CLICKED);
      case 'profile':
        return track(events.NAVIGATION_USER_PROFILE_CLICKED);
      default:
        return null;
    }
  };

  render() {
    const { history, match, currentUser, notificationCounts } = this.props;

    const loggedInUser = currentUser;

    if (isViewingMarketingPage(history, currentUser)) {
      return null;
    }

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
        <Nav hideOnMobile={hideNavOnMobile} data-cy="navbar">
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

          <Logo
            to="/"
            aria-hidden
            tabIndex="-1"
            isHidden={this.state.isSkipLinkFocused}
            onClick={() => this.trackNavigationClick('logo')}
            data-cy="navbar-logo"
          >
            <Icon glyph="logo" size={28} />
          </Logo>

          <SkipLink
            href="#main"
            onFocus={this.handleSkipLinkFocus}
            onBlur={this.handleSkipLinkBlur}
          >
            Skip to content
          </SkipLink>

          <HomeTab
            {...this.getTabProps(match.url === '/' && match.isExact)}
            to="/"
            onClick={() => this.trackNavigationClick('home')}
            data-cy="navbar-home"
          >
            <Icon glyph="home" size={isDesktopApp() ? 28 : 32} />
            <Label>Home</Label>
          </HomeTab>

          <MessagesTab
            active={history.location.pathname.includes('/messages')}
          />

          <ExploreTab
            {...this.getTabProps(history.location.pathname === '/explore')}
            to="/explore"
            onClick={() => this.trackNavigationClick('explore')}
            data-cy="navbar-explore"
          >
            <Icon glyph="explore" size={isDesktopApp() ? 28 : 32} />
            <Label>Explore</Label>
          </ExploreTab>

          <NotificationsTab
            onClick={() => this.trackNavigationClick('notifications')}
            location={history.location}
            currentUser={loggedInUser}
            active={history.location.pathname.includes('/notifications')}
          />

          <ProfileDrop>
            <Tab
              className={'hideOnMobile'}
              {...this.getTabProps(
                history.location.pathname === `/users/${loggedInUser.username}`
              )}
              to={loggedInUser ? `/users/${loggedInUser.username}` : '/'}
              onClick={() => this.trackNavigationClick('profile')}
            >
              <Navatar
                user={loggedInUser}
                size={28}
                showHoverProfile={false}
                showOnlineStatus={false}
                clickable={false}
                dataCy="navbar-profile"
              />
            </Tab>
            <ProfileDropdown user={loggedInUser} />
          </ProfileDrop>

          <ProfileTab
            className={'hideOnDesktop'}
            {...this.getTabProps(
              history.location.pathname === `/users/${loggedInUser.username}`
            )}
            to={loggedInUser ? `/users/${loggedInUser.username}` : '/'}
            onClick={() => this.trackNavigationClick('profile')}
          >
            <Icon glyph="profile" />
            <Label>Profile</Label>
          </ProfileTab>
        </Nav>
      );
    }

    if (!loggedInUser) {
      return (
        <Nav
          hideOnMobile={hideNavOnMobile}
          loggedOut={!loggedInUser}
          data-cy="navbar"
        >
          <Logo
            to="/"
            aria-hidden
            tabIndex="-1"
            isHidden={this.state.isSkipLinkFocused}
            data-cy="navbar-logo"
          >
            <Icon glyph="logo" size={28} />
          </Logo>

          <SkipLink
            href="#main"
            onFocus={this.handleSkipLinkFocus}
            onBlur={this.handleSkipLinkBlur}
          >
            Skip to content
          </SkipLink>

          <HomeTab
            className={'hideOnDesktop'}
            {...this.getTabProps(match.url === '/' && match.isExact)}
            to="/"
          >
            <Icon glyph="logo" />
            <Label>About</Label>
          </HomeTab>
          <ExploreTab
            {...this.getTabProps(history.location.pathname === '/explore')}
            to="/explore"
            loggedOut={!loggedInUser}
            data-cy="navbar-explore"
          >
            <Icon glyph="explore" />
            <Label>Explore</Label>
          </ExploreTab>
          <SupportTab
            {...this.getTabProps(history.location.pathname === '/support')}
            to="/support"
            data-cy="navbar-support"
          >
            <Icon glyph="like" />
            <Label>Support</Label>
          </SupportTab>
          <PricingTab
            {...this.getTabProps(history.location.pathname === '/pricing')}
            to="/pricing"
            data-cy="navbar-pricing"
          >
            <Icon glyph="payment" />
            <Label>Pricing</Label>
          </PricingTab>
          <SigninLink to="/login">Sign In</SigninLink>
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
