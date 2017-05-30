// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import Icon from '../../components/icons';
import { NotificationDropdown } from './components/notificationDropdown';
import { ProfileDropdown } from './components/profileDropdown';
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
} from './style';

class Navbar extends Component {
  render() {
    const { match, currentUser } = this.props;

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

            <IconLink
              data-active={match.url === '/explore'}
              data-mobileWidth={'third'}
              to="/explore"
            >
              <Icon glyph="explore" />
              <Label>Explore</Label>
            </IconLink>
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

              {/* TODO: Make this active only when viewing current logged in user profile */}
              <IconDrop>
                <IconLink
                  data-active={match.url === `/users/me`}
                  data-mobileWidth={'half'}
                  to={`/users/me`}
                >

                  <LabelForTab>Profile</LabelForTab>
                </IconLink>
                <ProfileDropdown />
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

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(Navbar);
