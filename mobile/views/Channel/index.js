// @flow
import * as React from 'react';
import { Text, View, FlatList } from 'react-native';
import compose from 'recompose/compose';
import getChannelById from '../../gql/channel/queries/getChannel';
import getChannelThreads from '../../gql/channel/queries/getChannelThreads';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import withSafeView from '../../components/SafeAreaView';
import ThreadFeed from '../../components/ThreadFeed';

import { Wrapper } from './style';

type ChannelType = {
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
    channel?: ChannelType,
  },
};

const ChannelThreadFeed = compose(getChannelThreads)(ThreadFeed);

class Channel extends React.Component<Props> {
  render() {
    const { data, isLoading, hasError, navigation } = this.props;

    if (data.channel) {
      return (
        <Wrapper>
          <View testID="e2e-commmunity">
            <Text>Now viewing channel {data.channel.name}!</Text>
          </View>
          <ChannelThreadFeed navigation={navigation} id={data.channel.id} />
        </Wrapper>
      );
    }

    if (isLoading) {
      return (
        <Wrapper>
          <View testID="e2e-channel">
            <Text>Loading...</Text>
          </View>
        </Wrapper>
      );
    }

    if (hasError) {
      return (
        <Wrapper>
          <View testID="e2e-channel">
            <Text>Error!</Text>
          </View>
        </Wrapper>
      );
    }

    return null;
  }
}

export default compose(withSafeView, getChannelById, ViewNetworkHandler)(
  Channel
);
