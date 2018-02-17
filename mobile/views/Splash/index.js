// @flow
import * as React from 'react';
import { View, Button } from 'react-native';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
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
import type { State } from '../../reducers';

import { Wrapper } from './style';

const EverythingThreadFeed = compose(getCurrentUserEverythingFeed)(ThreadFeed);

const mapStateToProps = (state: State): * => ({
  authentication: state.authentication,
});

type Props = {
  navigation: Object,
  authentication: {
    token?: string,
  },
  data: {
    user?: GetUserType,
  },
};
class Splash extends React.Component<Props> {
  render() {
    const { authentication } = this.props;
    return (
      <Wrapper>
        <View testID="welcome">
          {!authentication.token ? <Login /> : <EverythingThreadFeed />}
        </View>
      </Wrapper>
    );
  }
}

export default compose(withSafeView, getCurrentUser, connect(mapStateToProps))(
  Splash
);
