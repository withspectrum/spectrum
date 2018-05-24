// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withNavigation } from 'react-navigation';
import InfiniteList from '../../../components/InfiniteList';
import Text from '../../../components/Text';
import ViewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../../components/ViewNetworkHandler';
import DirectMessageThreadListItem from './DirectMessageThreadListItem';
import getCurrentUserDMThreadConnection, {
  type GetCurrentUserDMThreadConnectionType,
} from '../../../../shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';
import type { NavigationProps } from 'react-navigation';

type Props = {
  ...$Exact<ViewNetworkHandlerProps>,
  navigation: NavigationProps,
  data: {
    fetchMore: Function,
    user?: $Exact<GetCurrentUserDMThreadConnectionType>,
  },
};

const DirectMessageThreadsList = (props: Props) => {
  const { isLoading, hasError, data: { user } } = props;
  if (user) {
    const { pageInfo, edges } = user.directMessageThreadsConnection;
    return (
      <InfiniteList
        data={edges}
        renderItem={({ item: { node: thread } }) => (
          <DirectMessageThreadListItem
            thread={thread}
            key={thread.id}
            currentUserId={user.id}
            onPress={() =>
              props.navigation.navigate('DirectMessageThread', {
                id: thread.id,
              })
            }
          />
        )}
        hasNextPage={pageInfo.hasNextPage}
        fetchMore={props.data.fetchMore}
        loadingIndicator={<Text>Loading...</Text>}
      />
    );
  }
  if (isLoading) return <Text>Loading...</Text>;
  if (hasError) return <Text>Error</Text>;
  return <Text>No DM Threads yet</Text>;
};

export default compose(
  ViewNetworkHandler,
  getCurrentUserDMThreadConnection,
  withNavigation
)(DirectMessageThreadsList);
