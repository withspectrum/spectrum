import React, { Component } from 'react';
import queryString from 'query-string';
import Icon from '../../components/icons';
import FullscreenView from '../../components/fullscreenView';
import { getItemFromStorage, storeItem } from '../../helpers/localStorage';
import { SERVER_URL, CLIENT_URL } from '../../api/constants';
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

  constructor(props) {
    super(props);

    this.state = {
      isSigningIn: false,
      signinType: props.signinType || 'signup',
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
    const { redirectPath } = this.props;

    let r;
    if (this.props.location) {
      const searchObj = queryString.parse(this.props.location.search);
      r = searchObj.r;
    }

    const viewTitle =
      signinType === 'login' ? 'Welcome back!' : 'Sign in to get started';

    const viewSubtitle =
      signinType === 'login'
        ? "We're happy to see you again - log in below to get back into the conversation!"
        : 'Spectrum is a place where communities can share, discuss, and grow together. Sign in below to get in on the conversation.';

    const verb = signinType === 'login' ? 'Log in ' : 'Sign in ';

    const postAuthRedirectPath =
      redirectPath !== undefined || r !== undefined
        ? `?r=${redirectPath || r}`
        : `?r=${CLIENT_URL}/home`;

    return (
      <FullscreenView
        hasBackground
        noCloseButton={!this.props.close}
        close={this.props.close}
      >
        <FullscreenContent
          data-e2e-id="login-page"
          style={{ justifyContent: 'center' }}
        >
          <UpsellIconContainer>
            <Icon glyph={'emoji'} size={64} />
          </UpsellIconContainer>
          <LargeTitle>{viewTitle}</LargeTitle>
          <LargeSubtitle>{viewSubtitle}</LargeSubtitle>

          <SigninButtonsContainer noShadow>
            {preferredSigninMethod && (
              <Col>
                <ButtonTwitter
                  preferred={preferredSigninMethod === 'twitter'}
                  after={preferredSigninMethod === 'twitter'}
                  whitebg={preferredSigninMethod !== 'twitter'}
                  href={`${SERVER_URL}/auth/twitter${postAuthRedirectPath}`}
                  onClick={() => this.trackSignin('secondary cta', 'twitter')}
                >
                  <Icon glyph="twitter" /> <span>{verb} with Twitter</span>
                </ButtonTwitter>

                <ButtonFacebook
                  preferred={preferredSigninMethod === 'facebook'}
                  after={preferredSigninMethod === 'facebook'}
                  whitebg={preferredSigninMethod !== 'facebook'}
                  href={`${SERVER_URL}/auth/facebook${postAuthRedirectPath}`}
                  onClick={() => this.trackSignin('secondary cta', 'facebook')}
                >
                  <Icon glyph="facebook" /> <span>{verb} with Facebook</span>
                </ButtonFacebook>

                <ButtonGoogle
                  preferred={preferredSigninMethod === 'google'}
                  after={preferredSigninMethod === 'google'}
                  whitebg={preferredSigninMethod !== 'google'}
                  href={`${SERVER_URL}/auth/google${postAuthRedirectPath}`}
                  onClick={() => this.trackSignin('secondary cta', 'google')}
                >
                  <Icon glyph="google" /> <span>{verb} with Google</span>
                </ButtonGoogle>
              </Col>
            )}

            {!preferredSigninMethod && (
              <Col>
                <ButtonTwitter
                  preferred
                  href={`${SERVER_URL}/auth/twitter${postAuthRedirectPath}`}
                  after={preferredSigninMethod === 'twitter'}
                  onClick={() => this.trackSignin('secondary cta', 'twitter')}
                >
                  <Icon glyph="twitter" /> <span>{verb} with Twitter</span>
                </ButtonTwitter>

                <ButtonFacebook
                  preferred
                  href={`${SERVER_URL}/auth/facebook${postAuthRedirectPath}`}
                  after={preferredSigninMethod === 'facebook'}
                  onClick={() => this.trackSignin('secondary cta', 'facebook')}
                >
                  <Icon glyph="facebook" /> <span>{verb} with Facebook</span>
                </ButtonFacebook>

                <ButtonGoogle
                  preferred
                  href={`${SERVER_URL}/auth/google${postAuthRedirectPath}`}
                  after={preferredSigninMethod === 'google'}
                  onClick={() => this.trackSignin('secondary cta', 'google')}
                >
                  <Icon glyph="google" /> <span>{verb} with Google</span>
                </ButtonGoogle>
              </Col>
            )}
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

export default Login;
