// @flow
import React from 'react';
import { Text, View, Button } from 'react-native';
import { AuthSession, SecureStore } from 'expo';

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://spectrum.chat'
    : 'http://localhost:3001';

class Login extends React.Component<
  {},
  { session: string, 'session.sig': string }
> {
  state = {
    session: '',
    'session.sig': '',
  };
  authenticate = (provider: 'twitter' | 'facebook' | 'google') => async () => {
    const redirectUrl = AuthSession.getRedirectUrl();
    const result = await AuthSession.startAsync({
      authUrl: `${API_URL}/auth/${provider}?r=${redirectUrl}`,
    });
    if (result.type === 'error') {
      // Do something with result.errorCode and result.event
    }
    if (result.type === 'success') {
      const { params } = result;
      this.setState({
        session: params.session,
        'session.sig': params['session.sig'],
      });
      await Promise.all([
        SecureStore.setItemAsync('session', params.session),
        SecureStore.setItemAsync('session.sig', params['session.sig']),
      ]);
    }
    // The request was cancelled by the user
  };

  fetch = () => {
    const headers = new Headers({
      session: this.state.session,
      'session.sig': this.state['session.sig'],
      'Content-Type': 'application/json',
    });
    fetch('http://localhost:3001/api', {
      method: 'POST',
      body: JSON.stringify({
        query: '{ community(slug: "spectrum") { id } }',
      }),
      headers,
    }).then(res => console.log(res));
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
        {this.state.session ? (
          <View>
            <Button title="Fetch" onPress={this.fetch} />
          </View>
        ) : null}
      </View>
    );
  }
}

export default Login;
