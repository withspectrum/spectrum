// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Button, IconButton } from 'src/components/buttons';
import Link from 'src/components/link';
import Icon from 'src/components/icons';
import { Logo } from 'src/components/logo';
import Avatar from 'src/components/avatar';
import Head from 'src/components/head';
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
  MenuOverlay,
} from '../style';

type Props = {
  currentUser: Object,
};

type State = {
  menuIsOpen: boolean,
};

class Nav extends React.Component<Props, State> {
  state = { menuIsOpen: false };

  toggleMenu() {
    this.setState({ menuIsOpen: !this.state.menuIsOpen });
  }

  render() {
    return (
      <NavContainer>
        <Head
          title={'Spectrum'}
          description={'The community platform for the future.'}
        >
          <link
            rel="shortcut icon"
            id="dynamic-favicon"
            // $FlowIssue
            href={`${process.env.PUBLIC_URL}/img/favicon.ico`}
          />
        </Head>
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
                <Button>Sign In</Button>
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
              <PricingLink
                to="/pricing"
                selected={this.props.location === 'pricing'}
              >
                <Icon glyph="payment" />Pricing<Icon glyph="enter" />
              </PricingLink>
              <SupportLink
                to="/support"
                selected={this.props.location === 'support'}
              >
                <Icon glyph="like" />Support<Icon glyph="enter" />
              </SupportLink>
              <ExploreLink
                to="/explore"
                selected={this.props.location === 'explore'}
              >
                <Icon glyph="explore" />Explore<Icon glyph="enter" />
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
                  <span>Sign in</span>
                  <Icon glyph="enter" />
                </AuthLink>
              )}
            </MenuContainer>
            <MenuOverlay
              onClick={() => this.toggleMenu()}
              open={this.state.menuIsOpen}
            />
          </MenuTab>
        </Tabs>
      </NavContainer>
    );
  }
}

const map = state => ({ currentUser: state.users.currentUser });

// $FlowIssue
export default connect(map)(Nav);
