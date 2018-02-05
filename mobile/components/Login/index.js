// @flow
import React from 'react';
import { Text, View, Button } from 'react-native';
import { AuthSession, SecureStore } from 'expo';

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://spectrum.chat'
    : 'http://localhost:3001';

type State = { token?: string };

class Login extends React.Component<{}, State> {
  state = {
    token: '',
  };

  authenticate = (provider: 'twitter' | 'facebook' | 'google') => async () => {
    const redirectUrl = AuthSession.getRedirectUrl();
    const result = await AuthSession.startAsync({
      authUrl: `${API_URL}/auth/${provider}?r=${redirectUrl}&authType=token`,
    });
    if (result.type === 'error') {
      // Do something with result.errorCode and result.event
    }
    if (result.type === 'success') {
      const { params } = result;
      this.setState({
        token: params.accessToken,
      });
      await SecureStore.setItemAsync('token', params.accessToken);
    }
    // The request was cancelled by the user
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
      </View>
    );
  }
}

export default Login;
