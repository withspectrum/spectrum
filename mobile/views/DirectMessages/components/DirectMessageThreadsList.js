// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withNavigation } from 'react-navigation';
import InfiniteList from '../../../components/InfiniteList';
import Text from '../../../components/Text';
import ViewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../../components/ViewNetworkHandler';
import getCurrentUserDMThreadConnection, {
  type GetCurrentUserDMThreadConnectionType,
} from '../../../../shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';
import type { NavigationProps } from 'react-navigation';
import sentencify from '../../../../shared/sentencify';
import { timeDifferenceShort } from '../../../../shared/time-difference';
import { DirectMessageListItem } from '../../../components/Lists';

type Props = {
  ...$Exact<ViewNetworkHandlerProps>,
  navigation: NavigationProps,
  data: {
    fetchMore: Function,
    user?: $Exact<GetCurrentUserDMThreadConnectionType>,
    refetch: Function,
  },
};

const DirectMessageThreadsList = (props: Props) => {
  const { isLoading, hasError, data: { user } } = props;
  if (user) {
    const { pageInfo, edges } = user.directMessageThreadsConnection;
    return (
      <InfiniteList
        data={edges}
        renderItem={({ item: { node: thread } }) => {
          const participants = thread.participants.filter(
            ({ userId }) => userId !== user.id
          );

          return (
            <DirectMessageListItem
              key={thread.id}
              onPress={() =>
                props.navigation.navigate({
                  routeName: 'DirectMessageThread',
                  key: thread.id,
                  params: {
                    id: thread.id,
                  },
                })
              }
              participants={participants}
              title={sentencify(participants.map(({ name }) => name))}
              subtitle={thread.snippet}
              timestamp={timeDifferenceShort(
                Date.now(),
                new Date(thread.threadLastActive)
              )}
            />
          );
        }}
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
  withNavigation,
  getCurrentUserDMThreadConnection,
  ViewNetworkHandler
)(DirectMessageThreadsList);
