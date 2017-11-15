// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import queryString from 'query-string';
import { withApollo } from 'react-apollo';
import { getCurrentUserProfile } from '../../api/user';
import { openModal } from '../../actions/modals';
import Icon from '../../components/icons';
import viewNetworkHandler from '../../components/viewNetworkHandler';
import { Loading } from '../../components/loading';
import { ProfileDropdown } from './components/profileDropdown';
import NewUserOnboarding from '../../views/newUserOnboarding';
import MessagesTab from './components/messagesTab';
import NotificationsTab from './components/notificationsTab';
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

type Props = {
  isLoading: boolean,
  hasError: boolean,
  location: Object,
  history: Object,
  match: Object,
  data: {
    user?: Object,
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

    // Had no user, now have user or user changed
    if (
      (!nextProps.data.user && currProps.data.user) ||
      nextProps.data.user !== currProps.data.user
    )
      return true;

    // if the user is mobile and is viewing a thread or DM thread, re-render
    // the navbar when they exit the thread
    const { thread: thisThreadParam } = queryString.parse(
      currProps.history.location.search
    );
    const { thread: nextThreadParam } = queryString.parse(
      nextProps.history.location.search
    );
    if (thisThreadParam !== nextThreadParam) return true;

    // Fuck updating
    return false;
  }

  render() {
    const {
      history,
      match,
      data: { user },
      isLoading,
      hasError,
      currentUser,
    } = this.props;
    const loggedInUser = user || currentUser;
    const currentUserExists =
      loggedInUser !== null && loggedInUser !== undefined;
    const isHome =
      history.location.pathname === '/' ||
      history.location.pathname === '/home';

    // Bail out if the splash page is showing
    if (!currentUserExists && isHome) return null;

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

    if (currentUserExists) {
      return (
        <Nav hideOnMobile={hideNavOnMobile}>
          <Section>
            <LogoLink to="/">
              <Logo src="/img/mark-white.png" role="presentation" />
            </LogoLink>

            <IconLink data-active={match.url === '/' && match.isExact} to="/">
              <Icon glyph="home" />
              <Label>Home</Label>
            </IconLink>

            <MessagesTab
              active={history.location.pathname.includes('/messages')}
            />

            <IconLink
              data-active={history.location.pathname === '/explore'}
              to="/explore"
            >
              <Icon glyph="explore" />
              <Label>Explore</Label>
            </IconLink>

            <NotificationsTab
              currentUser={loggedInUser}
              active={history.location.pathname.includes('/notifications')}
            />

            <IconDrop>
              <IconLink
                hideOnMobile
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
                  user={loggedInUser}
                  src={`${loggedInUser.profilePhoto}`}
                />
              </IconLink>
              <ProfileDropdown user={loggedInUser} />
            </IconDrop>

            <IconLink
              hideOnDesktop
              style={{ alignSelf: 'flex-end' }}
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
    }

    if (isLoading) {
      return (
        <Nav hideOnMobile={hideNavOnMobile}>
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
    }

    if (hasError) {
      return (
        <Nav hideOnMobile={hideNavOnMobile}>
          <LogoLink to="/">
            <Logo src="/img/mark-white.png" role="presentation" />
          </LogoLink>
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
  // $FlowIssue
  connect(mapStateToProps),
  getCurrentUserProfile,
  withApollo,
  viewNetworkHandler
)(Navbar);
