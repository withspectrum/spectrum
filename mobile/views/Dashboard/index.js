// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import compose from 'recompose/compose';
import withSafeView from '../../components/SafeAreaView';
import Loading from '../../components/Loading';
import { Wrapper } from './style';
import ThreadFeed from '../../components/ThreadFeed';
import getCurrentUserEverythingFeed from '../../../shared/graphql/queries/user/getCurrentUserEverythingFeed';
import type { Navigation } from '../../utils/types';
import type { ViewNetworkHandlerProps } from '../../components/ViewNetworkHandler';

const EverythingThreadFeed = compose(getCurrentUserEverythingFeed)(ThreadFeed);

type Props = {
  navigation: Navigation,
};

class Dashboard extends Component<Props> {
  render() {
    return (
      <Wrapper>
        <View testID="welcome" style={{ flex: 1 }}>
          <EverythingThreadFeed />
        </View>
      </Wrapper>
    );
  }
}

export default compose(withSafeView)(Dashboard);
