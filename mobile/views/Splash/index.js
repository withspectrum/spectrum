// @flow
import * as React from 'react';
import { Text, View, Button } from 'react-native';
import compose from 'recompose/compose';
import withSafeView from '../../components/SafeAreaView';

import { Wrapper } from './style';

type Props = {
  navigation: Object,
};
class Splash extends React.Component<Props> {
  render() {
    return (
      <Wrapper>
        <View testID="welcome">
          <Button
            title={'thread'}
            onPress={() =>
              this.props.navigation.navigate(`Thread`, {
                id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a193',
              })
            }
          />
          <Button
            title={'community'}
            onPress={() =>
              this.props.navigation.navigate(`Community`, {
                id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a191',
              })
            }
          />
          <Button
            title={'channel'}
            onPress={() =>
              this.props.navigation.navigate(`Channel`, {
                id: 'ce2b4488-4c75-47e0-8ebc-2539c1e6a192',
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
