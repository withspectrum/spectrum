// @flow
import React from 'react';
import { connect } from 'react-redux';
import { AuthSession, SecureStore } from 'expo';
import { authenticate } from '../../actions/authentication';
import { DEV_BASE_URI } from '../../../shared/graphql/constants.native';
import {
  Container,
  Emoji,
  Title,
  Subtitle,
  FacebookButton,
  GithubButton,
  GoogleButton,
  TwitterButton,
  CodeOfConduct,
  Link,
} from './style';

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://spectrum.chat'
    : `http://${DEV_BASE_URI}`;

type Provider = 'twitter' | 'facebook' | 'google' | 'github';

type Props = {
  dispatch: Function,
};

class Login extends React.Component<Props> {
  authenticate = (provider: Provider) => async () => {
    const redirectUrl = AuthSession.getRedirectUrl();
    const result = await AuthSession.startAsync({
      authUrl: `${API_URL}/auth/${provider}?r=${redirectUrl}&authType=token`,
    });
    if (result.type === 'success') {
      const { params } = result;
      this.props.dispatch(authenticate(params.accessToken));
      await SecureStore.setItemAsync('token', params.accessToken);
    }
    if (result.type === 'error') {
      // Some error happened
      // TODO(@mxstbr): Error UI
    }
    // User cancelled the login request
    // TODO(@mxstbr): Cancel UI
  };

  render() {
    return (
      <Container testID="login">
        <Emoji />
        <Title>Sign in to get started</Title>
        <Subtitle>
          Spectrum is a place where communities can share, discuss, and grow
          together. Sign in below to get in on the conversation.
        </Subtitle>
        <TwitterButton onPress={this.authenticate('twitter')} />
        <GoogleButton onPress={this.authenticate('google')} />
        <FacebookButton onPress={this.authenticate('facebook')} />
        <GithubButton onPress={this.authenticate('github')} />
        <CodeOfConduct>By using Spectrum, you agree to our</CodeOfConduct>
        <Link href="https://github.com/withspectrum/code-of-conduct">
          Code of Conduct
        </Link>
      </Container>
    );
  }
}

export default connect()(Login);
