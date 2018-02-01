// @flow
import * as React from 'react';
import { Text, View, FlatList, ScrollView } from 'react-native';
import compose from 'recompose/compose';
import { getCommunityById } from '../../../shared/graphql/queries/community/getCommunity';
import getCommunityThreads from '../../../shared/graphql/queries/community/getCommunityThreadConnection';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import withSafeView from '../../components/SafeAreaView';
import ThreadFeed from '../../components/ThreadFeed';

import { Wrapper } from './style';

type CommunityType = {
  id: string,
  name: string,
  threadConnection: {
    pageInfo: {
      hasNextPage: boolean,
    },
    edges: {
      node: {
        id: string,
      },
    },
  },
};

type Props = {
  isLoading: boolean,
  hasError: boolean,
  navigation: Object,
  data: {
    community?: CommunityType,
  },
};

const CommunityThreadFeed = compose(getCommunityThreads)(ThreadFeed);
class Community extends React.Component<Props> {
  componentDidUpdate() {
    const { data: { community }, navigation } = this.props;
    if (!community || navigation.state.params.title) return;
    navigation.setParams({ title: community.name });
  }

  render() {
    const { data, isLoading, hasError, navigation } = this.props;

    if (data.community) {
      return (
        <Wrapper>
          <View>
            <CommunityThreadFeed
              navigation={navigation}
              id={data.community.id}
            />
          </View>
        </Wrapper>
      );
    }

    if (isLoading) {
      return (
        <Wrapper>
          <View testID="e2e-community">
            <Text>Loading...</Text>
          </View>
        </Wrapper>
      );
    }

    if (hasError) {
      return (
        <Wrapper>
          <View testID="e2e-community">
            <Text>Error!</Text>
          </View>
        </Wrapper>
      );
    }

    return null;
  }
}

export default compose(withSafeView, getCommunityById, ViewNetworkHandler)(
  Community
);
