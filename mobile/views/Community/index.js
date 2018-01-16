// @flow
import * as React from 'react';
import { Text, View, FlatList, ScrollView } from 'react-native';
import compose from 'recompose/compose';
import getCommunityById from '../../gql/community/queries/getCommunityById';
import getCommunityThreads from '../../gql/community/queries/getCommunityThreads';
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
  render() {
    const { data, isLoading, hasError, navigation } = this.props;

    if (data.community) {
      return (
        <Wrapper>
          <ScrollView>
            <View testID="e2e-commmunity">
              <Text>Now viewing community {data.community.name}!</Text>
            </View>
            <CommunityThreadFeed
              navigation={navigation}
              id={data.community.id}
            />
          </ScrollView>
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
