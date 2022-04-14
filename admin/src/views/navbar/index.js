import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import Icon from '../../components/icons';
import { Section, Nav, LogoLink, Logo, IconLink, Label } from './style';

class Navbar extends Component {
  render() {
    const url = this.props.location.pathname;
    return (
      <Nav>
        <Section left hideOnMobile>
          <LogoLink to="/">
            <Logo src="/img/mark-white.png" role="presentation" />
          </LogoLink>

          <IconLink data-active={url === '/'} to="/">
            <Icon glyph="home" />
            <Label>Home</Label>
          </IconLink>

          <IconLink data-active={url.includes('/threads')} to="/threads">
            <Icon glyph={'post'} />
            <Label>Threads</Label>
          </IconLink>

          <IconLink data-active={url.includes('/users')} to="/users">
            <Icon glyph={'profile'} />
            <Label>Users</Label>
          </IconLink>

          <IconLink
            data-active={url.includes('/communities')}
            to="/communities"
          >
            <Icon glyph={'community'} />
            <Label>Communities</Label>
          </IconLink>
        </Section>
      </Nav>
    );
  }
}

export default compose(withRouter, connect())(Navbar);
