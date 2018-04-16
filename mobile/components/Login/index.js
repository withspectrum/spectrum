// @flow
import React from 'react';
import { connect } from 'react-redux';
import { Text, View, Button } from 'react-native';
import { AuthSession, SecureStore } from 'expo';
import { authenticate } from '../../actions/authentication';

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://spectrum.chat'
    : 'http://localhost:3001';

type Props = {
  dispatch: Function,
};

class Login extends React.Component<Props> {
  authenticate = (
    provider: 'twitter' | 'facebook' | 'google' | 'github'
  ) => async () => {
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
      <View testID="login">
        <Button
          title="Login/Signup with Twitter"
          onPress={this.authenticate('twitter')}
        />
        <Button
          title="Login/Signup with Google"
          onPress={this.authenticate('google')}
        />
        <Button
          title="Login/Signup with Facebook"
          onPress={this.authenticate('facebook')}
        />
        <Button
          title="Login/Signup with Github"
          onPress={this.authenticate('github')}
        />
      </View>
    );
  }
}

export default connect()(Login);
