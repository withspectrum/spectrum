// @flow
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import compose from 'recompose/compose';
import { AuthSession } from 'expo';
import withSafeView from '../../components/SafeAreaView';

import { Wrapper } from './style';

const API_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://spectrum.chat'
    : 'http://localhost:3001';

type Props = {
  navigation: Object,
};
class Splash extends React.Component<Props> {
  authenticate = (provider: 'twitter' | 'facebook' | 'google') => async () => {
    const redirectUrl = AuthSession.getRedirectUrl();
    const result = await AuthSession.startAsync({
      authUrl: `${API_URL}/auth/${provider}?r=${redirectUrl}`,
    });
    if (result.type === 'error') {
      // Do something with result.errorCode and result.event
    }
    if (result.type === 'success') {
      // Yay we're signed in!
    }
    // The request was cancelled by the user
  };

  render() {
    return (
      <Wrapper>
        <View testID="welcome">
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
            title={'thread'}
            onPress={() =>
              this.props.navigation.navigate(`Thread`, {
                id: '7daace3e-ed88-4853-a293-e2a02f887869',
              })
            }
          />
          <Button
            title={'community'}
            onPress={() =>
              this.props.navigation.navigate(`Community`, {
                id: '-Kh6RfPYjmSaIWbkck8i',
              })
            }
          />
          <Button
            title={'channel'}
            onPress={() =>
              this.props.navigation.navigate(`Channel`, {
                id: '-Kenm0MXIRCq8GkwiJKb',
              })
            }
          />
          <Button
            title={'user'}
            onPress={() =>
              this.props.navigation.navigate(`User`, {
                id: '01p2A7kDCWUjGj6zQLlMQUOSQL42',
              })
            }
          />
        </View>
      </Wrapper>
    );
  }
}

export default compose(withSafeView)(Splash);
