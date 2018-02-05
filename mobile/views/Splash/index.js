// @flow
import * as React from 'react';
import { View, Button } from 'react-native';
import compose from 'recompose/compose';
import withSafeView from '../../components/SafeAreaView';
import Login from '../../components/Login';
import Text from '../../components/Text';
import {
  getCurrentUser,
  type GetUserType,
} from '../../../shared/graphql/queries/user/getUser';

import { Wrapper } from './style';

type Props = {
  navigation: Object,
  data: {
    user: GetUserType,
  },
};
class Splash extends React.Component<Props> {
  render() {
    const { user } = this.props.data;
    return (
      <Wrapper>
        <View testID="welcome">
          {!user && <Login />}
          {user && <Text type="body">{user.username} is logged in</Text>}
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

export default compose(withSafeView, getCurrentUser)(Splash);
