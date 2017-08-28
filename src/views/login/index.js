// @flow
import React, { Component } from 'react';
import Icon from '../../components/icons';
import FullscreenView from '../../components/fullscreenView';
import { getItemFromStorage, storeItem } from '../../helpers/localStorage';
import { SERVER_URL } from '../../api';
import {
  LargeTitle,
  LargeSubtitle,
  UpsellIconContainer,
  FullscreenContent,
  CodeOfConduct,
  SigninButtonsContainer,
  ButtonTwitter,
  ButtonFacebook,
  ButtonGoogle,
  Col,
} from './style';

export class Login extends Component {
  state: {
    isSigningIn: Boolean,
    signinType: string,
  };

  constructor() {
    super();

    this.state = {
      isSigningIn: false,
      signinType: '',
    };
  }

  toggleSigningIn = type => {
    const { isSigningIn } = this.state;
    this.setState({
      isSigningIn: !isSigningIn,
      signinType: type,
    });
  };

  trackSignin = (type, method) => {
    storeItem('preferred_signin_method', method);
  };

  render() {
    const { signinType } = this.state;
    const preferredSigninMethod = getItemFromStorage('preferred_signin_method');

    const viewTitle =
      signinType === 'signup' ? 'Good times ahead!' : 'Welcome back!';

    const viewSubtitle =
      signinType === 'signup'
        ? 'Spectrum is a place where communities can share, discuss, and grow together. Sign in below to get in on the conversation.'
        : "We're happy to see you again - log in below to get back into the conversation!";

    const verb = signinType === 'signup' ? 'Sign up' : 'Sign in';

    return (
      <FullscreenView
        hasBackground
        noCloseButton={!this.props.close}
        close={this.props.close}
      >
        <FullscreenContent>
          <UpsellIconContainer>
            <Icon glyph={'emoji'} size={64} />
          </UpsellIconContainer>
          <LargeTitle>
            {viewTitle}
          </LargeTitle>
          <LargeSubtitle>
            {viewSubtitle}
          </LargeSubtitle>

          <SigninButtonsContainer noShadow>
            {preferredSigninMethod &&
              <Col>
                <ButtonTwitter
                  preferred={preferredSigninMethod === 'twitter'}
                  after={preferredSigninMethod === 'twitter'}
                  whitebg={preferredSigninMethod !== 'twitter'}
                  href={`${SERVER_URL}/auth/twitter?r=${window.location.href}`}
                  onClick={() => this.trackSignin('secondary cta', 'twitter')}
                >
                  <Icon glyph="twitter" /> <span>{verb} with Twitter</span>
                </ButtonTwitter>

                <ButtonFacebook
                  preferred={preferredSigninMethod === 'facebook'}
                  after={preferredSigninMethod === 'facebook'}
                  whitebg={preferredSigninMethod !== 'facebook'}
                  href={`${SERVER_URL}/auth/facebook?r=${window.location.href}`}
                  onClick={() => this.trackSignin('secondary cta', 'facebook')}
                >
                  <Icon glyph="facebook" /> <span>{verb} with Facebook</span>
                </ButtonFacebook>

                <ButtonGoogle
                  preferred={preferredSigninMethod === 'google'}
                  after={preferredSigninMethod === 'google'}
                  whitebg={preferredSigninMethod !== 'google'}
                  href={`${SERVER_URL}/auth/google?r=${window.location.href}`}
                  onClick={() => this.trackSignin('secondary cta', 'google')}
                >
                  <Icon glyph="google" /> <span>{verb} with Google</span>
                </ButtonGoogle>
              </Col>}

            {!preferredSigninMethod &&
              <Col>
                <ButtonTwitter
                  preferred
                  href={`${SERVER_URL}/auth/twitter?r=${window.location.href}`}
                  after={preferredSigninMethod === 'twitter'}
                  onClick={() => this.trackSignin('secondary cta', 'twitter')}
                >
                  <Icon glyph="twitter" /> <span>{verb} with Twitter</span>
                </ButtonTwitter>

                <ButtonFacebook
                  preferred
                  href={`${SERVER_URL}/auth/facebook?r=${window.location.href}`}
                  after={preferredSigninMethod === 'facebook'}
                  onClick={() => this.trackSignin('secondary cta', 'facebook')}
                >
                  <Icon glyph="facebook" /> <span>{verb} with Facebook</span>
                </ButtonFacebook>

                <ButtonGoogle
                  preferred
                  href={`${SERVER_URL}/auth/google?r=${window.location.href}`}
                  after={preferredSigninMethod === 'google'}
                  onClick={() => this.trackSignin('secondary cta', 'google')}
                >
                  <Icon glyph="google" /> <span>{verb} with Google</span>
                </ButtonGoogle>
              </Col>}
          </SigninButtonsContainer>

          <CodeOfConduct>
            By using Spectrum, you agree to our{' '}
            <a
              href="https://github.com/withspectrum/code-of-conduct"
              target="_blank"
              rel="noopener noreferrer"
            >
              Code of Conduct
            </a>
          </CodeOfConduct>
        </FullscreenContent>
      </FullscreenView>
    );
  }
}
