// @flow
import * as React from 'react';
import { Text, View, FlatList } from 'react-native';
import compose from 'recompose/compose';
import getCommunityById from '../../gql/community/queries/getCommunity';
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
  data: {
    community?: CommunityType,
  },
};

const CommunityThreadFeed = compose(getCommunityThreads)(ThreadFeed);

class Community extends React.Component<Props> {
  render() {
    const { data, isLoading, hasError } = this.props;

    if (data.community) {
      return (
        <Wrapper>
          <View testID="e2e-commmunity">
            <Text>Now viewing community {data.community.name}!</Text>
          </View>
          <CommunityThreadFeed id={data.community.id} />
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
