// @flow
import React from 'react';
import ViewNetworkHandler from '../ViewNetworkHandler';
import Text from '../Text';
import { sortAndGroupMessages } from '../../../shared/clients/group-messages';

import type { ThreadMessageConnectionType } from '../../../shared/graphql/fragments/thread/threadMessageConnection.js';

type Props = {
  isLoading: boolean,
  hasError: boolean,
  data: {
    ...$Exact<ThreadMessageConnectionType>,
  },
};

class Messages extends React.Component<Props> {
  render() {
    const { data, isLoading, hasError } = this.props;

    if (data.thread && data.thread.messageConnection) {
      return (
        <Text type="body">
          {data.messageConnection.edges.length} messages loaded
        </Text>
      );
    }

    if (isLoading) {
      return <Text type="body">Loading...</Text>;
    }

    if (hasError) {
      return <Text type="body">Error :(</Text>;
    }

    return null;
  }
}

export default ViewNetworkHandler(Messages);
