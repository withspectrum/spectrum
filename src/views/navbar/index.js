import React, { Component } from 'react';
import Icon from '../../components/icons';
import {
  Container,
  Section,
  Nav,
  Spacer,
  LogoLink,
  Logo,
  IconLink,
  Label,
} from './style';

class Navbar extends Component {
  render() {
    const { match } = this.props;
    console.log(match, match.url, match.params);
    return (
      <Container>
        <Nav>
          <Section left>
            <LogoLink to="/">
              <Logo src="/img/mark-white.png" role="presentation" />
            </LogoLink>

            <IconLink
              data-active={match.url === '/'}
              data-mobileWidth={'third'}
              to="/"
            >
              <Icon icon="home" color={'bg.default'} static />
              <Label>Home</Label>
            </IconLink>

            <IconLink
              data-active={match.url.includes('/messages')}
              data-mobileWidth={'third'}
              to="/messages"
            >
              <Icon icon="messages" color={'bg.default'} static />
              <Label>Messages</Label>
            </IconLink>

            <IconLink
              data-active={match.url === '/explore'}
              data-mobileWidth={'third'}
              to="/explore"
            >
              <Icon icon="explore" color={'bg.default'} static />
              <Label>Explore</Label>
            </IconLink>
          </Section>

          <Section right>
            <IconLink
              data-active={match.url === '/notifications'}
              data-mobileWidth={'half'}
              to="/notifications"
            >
              <Icon icon="notification" color={'bg.default'} static />
              <Label>Notifications</Label>
            </IconLink>

            {/* TODO: Make this active only when viewing current logged in user profile */}
            <IconLink
              data-active={match.url === '/user/me'}
              data-mobileWidth={'half'}
              to="/user/me"
            >
              <Icon icon="notification" color={'bg.default'} static />
              <Label>Profile</Label>
            </IconLink>
          </Section>

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

export default Navbar;
