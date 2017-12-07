import React, { PureComponent } from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { Button } from '../../components/buttons';
import Link from '../../components/link';
import { Logo } from '../../components/logo';
import Avatar from '../../components/avatar';
import { DropTab } from '../navbar/style';
import {
  NavContainer,
  Tabs,
  LogoTab,
  PricingTab,
  SupportTab,
  AuthTab,
  SvgWrapper,
  InlineSvg,
} from './style';

const Goop = () => {
  return (
    <SvgWrapper>
      <InlineSvg
        fillRule="evenodd"
        clipRule="evenodd"
        xmlns="http://www.w3.org/2000/svg"
        aria-labelledby="title"
        viewBox="0 0 1920 64"
      >
        <title id="title">goop</title>
        <path d="M0,61l0,-61l1920,0l0,25c-196,36 -285,22 -493.5,22c-208.5,0 -1034,-81.5 -1426.5,14Z" />
      </InlineSvg>
    </SvgWrapper>
  );
};

class Nav extends PureComponent {
  // if currentUser exists (or a cookie), show the avatar and a "launch" button instead of the log in button...

  // if mobile, simplify navbar and add menu to get to add'l links

  render() {
    return (
      <NavContainer>
        <Tabs>
          <LogoTab to="/about">
            <Logo />
          </LogoTab>

          <PricingTab to="/pricing">Pricing</PricingTab>
          <SupportTab to="/support">Support</SupportTab>
          <AuthTab>
            {this.props.currentUser ? (
              <DropTab>
                <Avatar user={this.props.currentUser} />
              </DropTab>
            ) : (
              <Link to="/login">
                <Button>Log In</Button>
              </Link>
            )}
          </AuthTab>
        </Tabs>
        <Goop />
      </NavContainer>
    );
  }
}

const mapStateToProps = state => ({ currentUser: state.users.currentUser });

export default connect(mapStateToProps)(Nav);
