import React, { Component } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Button, IconButton } from '../../components/buttons';
import Link from '../../components/link';
import Icon from '../../components/icons';
import { Logo } from '../../components/logo';
import Avatar from '../../components/avatar';
import { DropTab } from '../navbar/style';
import {
  NavContainer,
  Tabs,
  LogoTab,
  MenuTab,
  PricingTab,
  SupportTab,
  AuthTab,
  LogoLink,
  AuthLink,
  PricingLink,
  SupportLink,
  ExploreLink,
  MenuContainer,
  SvgWrapper,
  InlineSvg,
} from './style';

class Nav extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menuIsOpen: false,
    };
  }

  toggleMenu() {
    this.setState({ menuIsOpen: !this.state.menuIsOpen });

    console.log('toggled', this.state.menuIsOpen);
  }

  render() {
    return (
      <NavContainer>
        <Tabs>
          <LogoTab dark={this.props.dark} to="/about">
            <Logo />
            <Icon glyph={'logo'} />
          </LogoTab>

          <PricingTab
            dark={this.props.dark}
            selected={this.props.location === 'pricing'}
            to="/pricing"
          >
            Pricing
          </PricingTab>
          <SupportTab
            dark={this.props.dark}
            selected={this.props.location === 'support'}
            to="/support"
          >
            Support
          </SupportTab>
          <AuthTab dark={this.props.dark}>
            {this.props.currentUser ? (
              <Link to={'/'}>
                <Avatar
                  src={this.props.currentUser.profilePhoto}
                  user={this.props.currentUser}
                />
              </Link>
            ) : (
              <Link to="/login">
                <Button>Log In</Button>
              </Link>
            )}
          </AuthTab>
          <MenuTab dark={this.props.dark} open={this.state.menuIsOpen}>
            <IconButton
              glyph={this.state.menuIsOpen ? 'view-close' : 'menu'}
              onClick={() => this.toggleMenu()}
            />
            <MenuContainer open={this.state.menuIsOpen}>
              <LogoLink to="/">
                <Logo />
              </LogoLink>
              <PricingLink to="/pricing">
                <Icon glyph="payment" />Pricing
              </PricingLink>
              <SupportLink to="/support">
                <Icon glyph="like" />Support
              </SupportLink>
              <ExploreLink to="/explore">
                <Icon glyph="explore" />Explore
              </ExploreLink>
              {this.props.currentUser ? (
                <AuthLink to={'/'}>
                  <Avatar
                    src={this.props.currentUser.profilePhoto}
                    user={this.props.currentUser}
                  />
                  <span>{this.props.currentUser.name}</span>
                  <Icon glyph="enter" />
                </AuthLink>
              ) : (
                <AuthLink to={'/login'}>
                  <Icon glyph="welcome" />
                  <span>Log in</span>
                  <Icon glyph="enter" />
                </AuthLink>
              )}
            </MenuContainer>
          </MenuTab>
        </Tabs>
      </NavContainer>
    );
  }
}

const mapStateToProps = state => ({ currentUser: state.users.currentUser });

export default connect(mapStateToProps)(Nav);
