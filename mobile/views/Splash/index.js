// @flow
import * as React from 'react';
import { View, Button } from 'react-native';
import compose from 'recompose/compose';
import withSafeView from '../../components/SafeAreaView';
import Login from '../../components/Login';
import Text from '../../components/Text';
import ThreadFeed from '../../components/ThreadFeed';
import getCurrentUserEverythingFeed, {
  type GetCurrentUserEverythingFeedType,
} from '../../../shared/graphql/queries/user/getCurrentUserEverythingFeed';
import {
  getCurrentUser,
  type GetUserType,
} from '../../../shared/graphql/queries/user/getUser';

import { Wrapper } from './style';

const EverythingThreadFeed = compose(getCurrentUserEverythingFeed)(ThreadFeed);

type Props = {
  navigation: Object,
  data: {
    user?: GetUserType,
  },
};
class Splash extends React.Component<Props> {
  render() {
    return (
      <Wrapper>
        <View testID="welcome">
          {!this.props.data.user && <Login />}
          <EverythingThreadFeed />
        </View>
      </Wrapper>
    );
  }
}

export default compose(withSafeView, getCurrentUser)(Splash);
