// @flow
import * as React from 'react';
import { Text, View, FlatList } from 'react-native';
import compose from 'recompose/compose';
import getCommunityById from '../../gql/community/queries/getCommunity';
import ViewNetworkHandler from '../../components/viewNetworkHandler';
import withSafeView from '../../components/safeAreaView';

import { Wrapper } from './style';

type CommunityType = {
  id: string,
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

class Community extends React.Component<Props> {
  render() {
    const { data, isLoading, hasError } = this.props;

    if (data.community) {
      return (
        <Wrapper>
          <View testID="e2e-commmunity">
            <Text>Now viewing community {data.community.name}!</Text>
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
