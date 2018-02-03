// @flow
import * as React from 'react';
import { Text, View, FlatList, Button, ScrollView } from 'react-native';
import compose from 'recompose/compose';
import { getUserById } from '../../../shared/graphql/queries/user/getUser';
import getUserThreadConnection from '../../../shared/graphql/queries/user/getUserThreadConnection';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import withSafeView from '../../components/SafeAreaView';
import ThreadFeed from '../../components/ThreadFeed';

import { Wrapper } from './style';

type UserType = {
  id: string,
  name: string,
  username: string,
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
    user?: UserType,
  },
};

type State = {
  feed: string,
};

const UserThreadFeed = compose(getUserThreadConnection)(ThreadFeed);

class User extends React.Component<Props, State> {
  state = { feed: 'participant' };

  componentDidUpdate() {
    const { data: { user }, navigation } = this.props;
    if (!user || navigation.state.params.title) return;
    navigation.setParams({ title: `${user.name} (@${user.username})` });
  }

  toggleFeed = (feed: string) => this.setState({ feed });

  render() {
    const { data, isLoading, hasError, navigation } = this.props;
    const { feed } = this.state;

    if (data.user) {
      return (
        <Wrapper>
          <Button
            title={'View active conversations'}
            onPress={() => this.toggleFeed('participant')}
          />

          <Button
            title={'View created conversations'}
            onPress={() => this.toggleFeed('creator')}
          />

          <Text>Viewing {this.state.feed} thread feed</Text>

          <UserThreadFeed
            navigation={navigation}
            kind={this.state.feed}
            id={data.user.id}
          />
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
