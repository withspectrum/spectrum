// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import compose from 'recompose/compose';
import Icon from '../../components/icons';
import { Section, Nav, LogoLink, Logo, IconLink, Label } from './style';

class Navbar extends Component {
  render() {
    const { match } = this.props;
    console.log('match', match);
    return (
      <Nav>
        <Section left hideOnMobile>
          <LogoLink to="/">
            <Logo src="/img/mark-white.png" role="presentation" />
          </LogoLink>

          <IconLink data-active={match.url === '/' && match.isExact} to="/">
            <Icon glyph="home" />
            <Label>Home</Label>
          </IconLink>

          <IconLink data-active={match.url.includes('/users')} to="/users">
            <Icon glyph={'profile'} />
            <Label>Users</Label>
          </IconLink>
        </Section>
      </Nav>
    );
  }
}

export default compose(connect())(Navbar);
