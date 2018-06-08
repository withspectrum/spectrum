// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import compose from 'recompose/compose';
import withSafeView from '../../components/SafeAreaView';
import ThreadFeed from '../../components/ThreadFeed';
import getCurrentUserEverythingFeed from '../../../shared/graphql/queries/user/getCurrentUserEverythingFeed';
import type { NavigationProps } from 'react-navigation';
import {
  getCurrentUser,
  type GetUserType,
} from '../../../shared/graphql/queries/user/getUser';

import { Wrapper } from './style';
import ErrorBoundary from '../../components/ErrorBoundary';

const EverythingThreadFeed = compose(getCurrentUserEverythingFeed)(ThreadFeed);

type Props = {
  navigation: NavigationProps,
  data: {
    user?: GetUserType,
  },
};

class Dashboard extends Component<Props> {
  render() {
    const { navigation } = this.props;

    return (
      <Wrapper>
        <View testID="welcome" style={{ flex: 1 }}>
          <ErrorBoundary>
            <EverythingThreadFeed navigation={navigation} />
          </ErrorBoundary>
        </View>
      </Wrapper>
    );
  }
}

export default compose(withSafeView, getCurrentUser)(Dashboard);
