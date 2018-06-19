// @flow
import React from 'react';
import compose from 'recompose/compose';
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
import Loading from '../../../components/Loading';
import ErrorBoundary from '../../../components/ErrorBoundary';
import { FullscreenNullState } from '../../../components/NullStates';

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
  const { isLoading, hasError, data: { user }, navigation } = props;
  if (user) {
    const { pageInfo, edges } = user.directMessageThreadsConnection;
    return (
      <InfiniteList
        data={edges}
        renderItem={({ item: { node: thread } }) => {
          const me = thread.participants.find(
            ({ userId }) => userId === user.id
          );
          const participants = thread.participants.filter(
            ({ userId }) => userId !== user.id
          );

          return (
            <ErrorBoundary fallbackComponent={null}>
              <DirectMessageListItem
                key={thread.id}
                onPressHandler={() =>
                  navigation.navigate({
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
                unread={
                  new Date(me.lastSeen).getTime() <
                  new Date(thread.threadLastActive).getTime()
                }
              />
            </ErrorBoundary>
          );
        }}
        hasNextPage={pageInfo.hasNextPage}
        fetchMore={props.data.fetchMore}
        loadingIndicator={<Loading />}
      />
    );
  }
  if (isLoading) return <Loading />;
  if (hasError) return <FullscreenNullState />;
  return <Text>No DM Threads yet</Text>;
};

export default compose(getCurrentUserDMThreadConnection, ViewNetworkHandler)(
  DirectMessageThreadsList
);
