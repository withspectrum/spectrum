// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { PrimaryButton } from 'src/components/button';
import Icon from 'src/components/icon';
import { Link } from 'react-router-dom';
import { Logo } from 'src/components/logo';
import { UserAvatar } from 'src/components/avatar';
import Head from 'src/components/head';
import { withCurrentUser } from 'src/components/withCurrentUser';
import {
  NavContainer,
  Tabs,
  LogoTab,
  MenuTab,
  SupportTab,
  FeaturesTab,
  AppsTab,
  AuthTab,
  LogoLink,
  AuthLink,
  SupportLink,
  FeaturesLink,
  AppsLink,
  ExploreLink,
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
      <NavContainer data-cy="navigation-splash">
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
            data-cy="navigation-splash-about"
          >
            <Logo />
            <Icon glyph={'logo'} />
          </LogoTab>
          <FeaturesTab
            dark={this.props.dark}
            selected={this.props.location === 'features'}
            to="/features"
            data-cy="navigation-splash-features"
          >
            Features
          </FeaturesTab>
          <AppsTab
            dark={this.props.dark}
            selected={this.props.location === 'apps'}
            to="/apps"
            data-cy="navigation-splash-apps"
          >
            Apps
          </AppsTab>
          <SupportTab
            dark={this.props.dark}
            selected={this.props.location === 'support'}
            to="/support"
            data-cy="navigation-splash-support"
          >
            Support
          </SupportTab>
          <AuthTab dark={this.props.dark}>
            {this.props.currentUser ? (
              <Link to={'/'}>
                <UserAvatar
                  user={this.props.currentUser}
                  dataCy="navigation-splash-profile"
                  clickable={false}
                  showOnlineStatus={false}
                  showHoverProfile={false}
                />
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => track(events.HOME_PAGE_SIGN_IN_CLICKED)}
              >
                <PrimaryButton
                  data-cy="navigation-splash-signin"
                  style={{
                    fontWeight: '700',
                    fontSize: '16px',
                    letterSpacing: '0.5px',
                  }}
                >
                  Log in or sign up
                </PrimaryButton>
              </Link>
            )}
          </AuthTab>
          <MenuTab dark={this.props.dark} open={this.state.menuIsOpen}>
            <Icon
              glyph={this.state.menuIsOpen ? 'view-close' : 'menu'}
              onClick={() => this.toggleMenu()}
            />
            <MenuContainer open={this.state.menuIsOpen}>
              <LogoLink to="/">
                <Logo />
              </LogoLink>
              <FeaturesLink
                to="/features"
                selected={this.props.location === 'features'}
              >
                Features
              </FeaturesLink>
              <AppsLink to="/apps" selected={this.props.location === 'apps'}>
                Apps
              </AppsLink>
              <SupportLink
                to="/support"
                selected={this.props.location === 'support'}
              >
                Support
              </SupportLink>
              <ExploreLink
                to="/explore"
                selected={this.props.location === 'explore'}
              >
                Explore
              </ExploreLink>
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

export default compose(
  withCurrentUser,
  connect()
)(Nav);
