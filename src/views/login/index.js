// @flow
import * as React from 'react';
import Icon from '../../components/icons';
import FullscreenView from '../../components/fullscreenView';
import LoginButtonSet from '../../components/loginButtonSet';
import {
  LargeTitle,
  LargeSubtitle,
  UpsellIconContainer,
  FullscreenContent,
  CodeOfConduct,
} from './style';

type Props = {
  redirectPath: ?string,
  signinType?: ?string,
};

export class Login extends React.Component<Props> {
  render() {
    const { redirectPath, signinType = 'signin' } = this.props;

    const viewTitle =
      signinType === 'login' ? 'Welcome back!' : 'Sign in to get started';

    const viewSubtitle =
      signinType === 'login'
        ? "We're happy to see you again - log in below to get back into the conversation!"
        : 'Spectrum is a place where communities can share, discuss, and grow together. Sign in below to get in on the conversation.';

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

          <LoginButtonSet redirectPath={redirectPath} signinType={signinType} />

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
