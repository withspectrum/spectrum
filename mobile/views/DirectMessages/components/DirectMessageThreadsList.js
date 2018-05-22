// @flow
import React, { Fragment } from 'react';
import compose from 'recompose/compose';
import { Query } from 'react-apollo';
import InfiniteList from '../../../components/InfiniteList';
import Text from '../../../components/Text';
import ViewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../../components/ViewNetworkHandler';

import { getCurrentUserQuery } from '../../../../shared/graphql/queries/user/getUser';
import getCurrentUserDMThreadConnection, {
  type GetCurrentUserDMThreadConnectionType,
} from '../../../../shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';
import sentencify from '../../../../shared/sentencify';

type Props = {
  ...$Exact<ViewNetworkHandlerProps>,
  data: {
    user?: $Exact<GetCurrentUserDMThreadConnectionType>,
  },
};

const DirectMessageThreadsList = (props: Props) => {
  const { isLoading, hasError, data: { user } } = props;
  if (user) {
    const { pageInfo, edges } = user.directMessageThreadsConnection;
    return (
      <Fragment>
        <InfiniteList
          data={edges}
          renderItem={({ item: { node: thread } }) => (
            <Fragment key={thread.id}>
              <Text type="headline">
                {sentencify(
                  thread.participants
                    .filter(({ userId }) => userId !== user.id)
                    .map(({ name }) => name)
                )}
              </Text>
              <Text type="body">{thread.snippet}</Text>
            </Fragment>
          )}
          hasNextPage={pageInfo.hasNextPage}
          fetchMore={props.data.fetchMore}
          loadingIndicator={<Text>Loading...</Text>}
        />
      </Fragment>
    );
  }
  if (isLoading) return <Text>Loading...</Text>;
  if (hasError) return <Text>Error</Text>;
  return <Text>No DM Threads yet</Text>;
};

export default compose(ViewNetworkHandler, getCurrentUserDMThreadConnection)(
  DirectMessageThreadsList
);
