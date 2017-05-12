// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
import Icon from '../../components/icons';
import { Button, LinkButton } from '../../components/buttons';
import Dropdown from '../../components/dropdown';
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
  DropdownFooter,
  DropdownHeader,
} from './style';

import NotificationList from '../notifications/components/notificationList';

import UserAvatar from '../user/components/userAvatar';

class Navbar extends Component {
  render() {
    const { match, currentUser } = this.props;

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
              <Icon
                icon="home"
                color={'bg.default'}
                hoverColor={'bg.default'}
              />
              <Label>Home</Label>
            </IconLink>

            <IconLink
              data-active={match.url.includes('/messages')}
              data-mobileWidth={'third'}
              to="/messages"
            >
              <Icon
                icon="messages"
                color={'bg.default'}
                hoverColor={'bg.default'}
              />
              <Label>Messages</Label>
            </IconLink>

            <IconLink
              data-active={match.url === '/explore'}
              data-mobileWidth={'third'}
              to="/explore"
            >
              <Icon
                icon="explore"
                color={'bg.default'}
                hoverColor={'bg.default'}
              />
              <Label>Explore</Label>
            </IconLink>
          </Section>

          <Section right>
            <IconDrop>
              <IconLink
                data-active={match.url === '/notifications'}
                data-mobileWidth={'half'}
                to="/notifications"
              >
                <Icon
                  icon="notification"
                  color={'bg.default'}
                  hoverColor={'bg.default'}
                />
                <LabelForTab>Notifications</LabelForTab>
              </IconLink>
              <Dropdown>
                <DropdownHeader>
                  My Notifications
                </DropdownHeader>

                <DropdownFooter>
                  <LinkButton to={'/notifications'}>View all</LinkButton>
                </DropdownFooter>
              </Dropdown>
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
              <Dropdown width={'240px'}>

                <DropdownFooter>
                  <Button color={'warn'}>Log Out</Button>
                </DropdownFooter>
              </Dropdown>
            </IconDrop>
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

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(Navbar);
