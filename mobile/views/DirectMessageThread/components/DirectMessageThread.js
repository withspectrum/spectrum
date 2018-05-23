// @flow
import React, { Fragment } from 'react';
import { View } from 'react-native';
import compose from 'recompose/compose';
import Text from '../../../components/Text';
import Messages from '../../../components/Messages';
import ViewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../../components/ViewNetworkHandler';

import getDirectMessageThread, {
  type GetDirectMessageThreadType,
} from '../../../../shared/graphql/queries/directMessageThread/getDirectMessageThread';
import getDirectMessageThreadMessageConnection from '../../../../shared/graphql/queries/directMessageThread/getDirectMessageThreadMessageConnection';
import type { DirectMessageThreadInfoType } from '../../../../shared/graphql/fragments/directMessageThread/directMessageThreadInfo';

const DirectMessageThreadMessages = getDirectMessageThreadMessageConnection(
  Messages
);

type Props = {
  id: string,
  ...$Exact<ViewNetworkHandlerProps>,
  data: {
    directMessageThread?: GetDirectMessageThreadType,
  },
};

const DirectMessageThread = (props: Props) => {
  const { isLoading, hasError, data: { directMessageThread } } = props;
  if (directMessageThread) {
    return (
      <View>
        <DirectMessageThreadMessages id={directMessageThread.id} />
      </View>
    );
  }

  if (isLoading) return <Text>Loading...</Text>;
  if (hasError) return <Text>Error :(</Text>;
  return null;
};

export default compose(ViewNetworkHandler, getDirectMessageThread)(
  DirectMessageThread
);
