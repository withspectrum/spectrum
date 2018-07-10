// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Button, IconButton } from 'src/components/buttons';
import Link from 'src/components/link';
import Icon from 'src/components/icons';
import { Logo } from 'src/components/logo';
import { UserAvatar } from 'src/components/avatar';
import Head from 'src/components/head';
import {
  NavContainer,
  Tabs,
  LogoTab,
  MenuTab,
  PricingTab,
  SupportTab,
  FeaturesTab,
  AuthTab,
  LogoLink,
  AuthLink,
  DropdownLink,
  MenuContainer,
  MenuOverlay,
} from '../style';
import { track, events } from 'src/helpers/analytics';

type Props = {
  currentUser: Object,
  location: Object,
  dark?: boolean,
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
      <NavContainer data-cy="navbar-splash">
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
          <LogoTab
            dark={this.props.dark}
            to="/about"
            data-cy="navbar-splash-about"
          >
            <Logo />
            <Icon glyph={'logo'} />
          </LogoTab>
          <FeaturesTab
            dark={this.props.dark}
            selected={this.props.location === 'features'}
            to="/features"
            data-cy="navbar-splash-features"
          >
            Features
          </FeaturesTab>
          <PricingTab
            dark={this.props.dark}
            selected={
              this.props.location === 'pricing' ||
              this.props.location === 'pricing/concierge'
            }
            to="/pricing"
            data-cy="navbar-splash-pricing"
          >
            Pricing
          </PricingTab>
          <SupportTab
            dark={this.props.dark}
            selected={this.props.location === 'support'}
            to="/support"
            data-cy="navbar-splash-support"
          >
            Support
          </SupportTab>
          <AuthTab dark={this.props.dark}>
            {this.props.currentUser ? (
              <Link to={'/'} data-cy="navbar-splash-profile">
                <UserAvatar user={this.props.currentUser} />
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => track(events.HOME_PAGE_SIGN_IN_CLICKED)}
              >
                <Button
                  data-cy="navbar-splash-signin"
                  style={{
                    fontWeight: '700',
                    fontSize: '16px',
                    letterSpacing: '0.5px',
                  }}
                >
                  Sign In
                </Button>
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
              <DropdownLink
                to="/features"
                selected={this.props.location === 'features'}
              >
                <Icon glyph="checkmark" />Features
              </DropdownLink>
              <DropdownLink
                to="/pricing"
                selected={
                  this.props.location === 'pricing' ||
                  this.props.location === 'pricing/concierge'
                }
              >
                <Icon glyph="payment" />Pricing
              </DropdownLink>
              <DropdownLink
                to="/support"
                selected={this.props.location === 'support'}
              >
                <Icon glyph="like" />Support
              </DropdownLink>
              <DropdownLink
                to="/explore"
                selected={this.props.location === 'explore'}
              >
                <Icon glyph="explore" />Explore
              </DropdownLink>
              {this.props.currentUser ? (
                <AuthLink to={'/'}>
                  <span>Return home</span>
                </AuthLink>
              ) : (
                <AuthLink
                  to={'/login'}
                  onClick={() => track(events.HOME_PAGE_SIGN_IN_CLICKED)}
                >
                  <span>Log in or sign up</span>
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
