// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
import compose from 'recompose/compose';
import { getCurrentUserProfile } from '../../api/user';
import Icon from '../../components/icons';
import { displayLoadingCard } from '../../components/loading';
import { Avatar } from '../../components/avatar';
import { NotificationDropdown } from './components/notificationDropdown';
import { ProfileDropdown } from './components/profileDropdown';
import { saveUserDataToLocalStorage } from '../../actions/authentication';
import {
  Container,
  Section,
  Nav,
  Spacer,
  LogoLink,
  Logo,
  IconDrop,
  IconLink,
  Label,
  LabelForTab,
  UserProfileAvatar,
} from './style';

class Navbar extends Component {
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

  render() {
    const { match, data: { user } } = this.props;
    const currentUser = user;

    if (!currentUser || currentUser === null) {
      return (
        <Container>
          {/*
            Nav contains global navigation elements like getting to messages,
            profile, home, explore, etc.
          */}
          <Nav>
            <Section left>
              <LogoLink to="/">
                <Logo src="/img/mark-white.png" role="presentation" />
              </LogoLink>
              {/* <IconLink
                data-active={match.url === '/explore'}
                data-mobileWidth={'third'}
                to="/explore"
              >
                <Icon glyph="explore" />
                <Label>Explore</Label>
              </IconLink> */}
            </Section>
          </Nav>

          {/*
            Spacer is used to globally push all app elements below the fixed
            position nav
          */}
          <Spacer />
        </Container>
      );
    } else {
      return (
        <Container>
          {/*
            Nav contains global navigation elements like getting to messages,
            profile, home, explore, etc.
          */}
          <Nav>
            <Section left>
              <LogoLink to="/">
                <Logo src="/img/mark-white.png" role="presentation" />
              </LogoLink>
              {currentUser &&
                <IconLink
                  data-active={match.url === '/'}
                  data-mobileWidth={'third'}
                  to="/"
                >
                  <Icon glyph="home" />
                  <Label>Home</Label>
                </IconLink>}

              {currentUser &&
                <IconLink
                  data-active={match.url.includes('/messages')}
                  data-mobileWidth={'third'}
                  to="/messages"
                >
                  <Icon glyph="message" />
                  <Label>Messages</Label>
                </IconLink>}

              {/* <IconLink
                data-active={match.url === '/explore'}
                data-mobileWidth={'third'}
                to="/explore"
              >
                <Icon glyph="explore" />
                <Label>Explore</Label>
              </IconLink> */}
            </Section>

            {currentUser &&
              <Section right>
                <IconDrop>
                  <IconLink
                    data-active={match.url === '/notifications'}
                    data-mobileWidth={'half'}
                    to="/notifications"
                  >
                    <Icon glyph="notification" />
                    <LabelForTab>Notifications</LabelForTab>
                  </IconLink>
                  {/* <NotificationDropdown /> */}
                </IconDrop>

                <IconDrop>
                  <IconLink
                    data-active={match.url === `/users/${currentUser.username}`}
                    data-mobileWidth={'half'}
                    to={`/users/${currentUser.username}`}
                  >
                    <UserProfileAvatar
                      src={currentUser.profilePhoto}
                      isPro={currentUser.isPro}
                      size="24"
                      radius="32"
                    />
                    <LabelForTab>Profile</LabelForTab>
                  </IconLink>
                  <ProfileDropdown history={history} user={currentUser} />
                </IconDrop>
              </Section>}

          </Nav>

          {/*
            Spacer is used to globally push all app elements below the fixed
            position nav
          */}
          <Spacer />
        </Container>
      );
    }
  }
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default compose(
  getCurrentUserProfile,
  withRouter,
  displayLoadingCard,
  connect(mapStateToProps)
)(Navbar);
