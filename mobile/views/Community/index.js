// @flow
import * as React from 'react';
import { Text, View } from 'react-native';
import compose from 'recompose/compose';
import { withNavigation } from 'react-navigation';
import {
  getCommunityById,
  type GetCommunityType,
} from '../../../shared/graphql/queries/community/getCommunity';
import getCommunityThreads from '../../../shared/graphql/queries/community/getCommunityThreadConnection';
import ViewNetworkHandler from '../../components/ViewNetworkHandler';
import withSafeView from '../../components/SafeAreaView';
import ThreadFeed from '../../components/ThreadFeed';
import ThreadItem from '../../components/ThreadItem';
import { getThreadById } from '../../../shared/graphql/queries/thread/getThread';

import { Wrapper } from './style';

type Props = {
  isLoading: boolean,
  hasError: boolean,
  navigation: Object,
  data: {
    community?: GetCommunityType,
  },
};

const RemoteThreadItem = compose(getThreadById, withNavigation)(
  ({ data, navigation }) => {
    if (data.loading) return <Text>Loading...</Text>;
    if (!data.thread) return null;
    return <ThreadItem thread={data.thread} navigation={navigation} />;
  }
);
const CommunityThreadFeed = compose(getCommunityThreads)(ThreadFeed);
class Community extends React.Component<Props> {
  componentDidUpdate() {
    const { data: { community }, navigation } = this.props;
    if (!community || navigation.state.params.title) return;
    navigation.setParams({ title: community.name });
  }

  render() {
    const { data: { community }, isLoading, hasError, navigation } = this.props;

    if (community) {
      return (
        <Wrapper>
          {community.pinnedThreadId && (
            <RemoteThreadItem id={community.pinnedThreadId} />
          )}
          {community.watercoolerId && (
            <RemoteThreadItem id={community.watercoolerId} />
          )}
          <CommunityThreadFeed navigation={navigation} id={community.id} />
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
