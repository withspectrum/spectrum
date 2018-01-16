// @flow
import * as React from 'react';
import { Text, View, FlatList, Button } from 'react-native';
import compose from 'recompose/compose';
import getUserById from '../../gql/user/queries/getUserById';
import getUserThreads from '../../gql/user/queries/getUserThreads';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import withSafeView from '../../components/SafeAreaView';
import ThreadFeed from '../../components/ThreadFeed';

import { Wrapper } from './style';

type UserType = {
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
    user?: UserType,
  },
};

type State = {
  feed: 'participant' | 'creator',
};

const UserThreadFeed = compose(getUserThreads)(ThreadFeed);

class User extends React.Component<Props, State> {
  state = {
    feed: 'participant',
  };

  toggleFeed = (feed: string) => {
    return this.setState({ feed });
  };

  render() {
    const { data, isLoading, hasError } = this.props;
    const { feed } = this.state;

    if (data.user) {
      return (
        <Wrapper>
          <View testID="e2e-commmunity">
            <Text>Now viewing User {data.user.name}!</Text>
          </View>

          <Button
            title={'View active conversations'}
            onPress={() => this.toggleFeed('participant')}
          />

          <Button
            title={'View created conversations'}
            onPress={() => this.toggleFeed('creator')}
          />

          <Text>Viewing {this.state.feed} thread feed</Text>

          <UserThreadFeed kind={this.state.feed} id={data.user.id} />
        </Wrapper>
      );
    }

    if (isLoading) {
      return (
        <Wrapper>
          <View testID="e2e-User">
            <Text>Loading...</Text>
          </View>
        </Wrapper>
      );
    }

    if (hasError) {
      return (
        <Wrapper>
          <View testID="e2e-User">
            <Text>Error!</Text>
          </View>
        </Wrapper>
      );
    }

    return null;
  }
}

export default compose(withSafeView, getUserById, ViewNetworkHandler)(User);
