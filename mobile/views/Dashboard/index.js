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
import {
  getCurrentUser,
  type GetUserType,
} from '../../../shared/graphql/queries/user/getUser';
import type { ViewNetworkHandlerProps } from '../../components/ViewNetworkHandler';

const EverythingThreadFeed = compose(getCurrentUserEverythingFeed)(ThreadFeed);

type Props = {
  navigation: Navigation,
  data: {
    user: GetUserType,
    ...$Exact<ViewNetworkHandlerProps>,
  },
};

class Dashboard extends Component<Props> {
  render() {
    const { data } = this.props;
    if (data.loading) <Loading />;

    return (
      <Wrapper>
        <View testID="welcome" style={{ flex: 1 }}>
          <EverythingThreadFeed currentUser={data.user} />
        </View>
      </Wrapper>
    );
  }
}

export default compose(withSafeView, getCurrentUser)(Dashboard);
