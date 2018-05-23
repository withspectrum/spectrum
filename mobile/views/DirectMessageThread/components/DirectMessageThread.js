// @flow
import React, { Fragment } from 'react';
import { View } from 'react-native';
import compose from 'recompose/compose';
import { Query } from 'react-apollo';
import Text from '../../../components/Text';
import ChatInput from '../../../components/ChatInput';
import Messages from '../../../components/Messages';
import ViewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../../components/ViewNetworkHandler';

import getDirectMessageThread, {
  type GetDirectMessageThreadType,
} from '../../../../shared/graphql/queries/directMessageThread/getDirectMessageThread';
import getDirectMessageThreadMessageConnection from '../../../../shared/graphql/queries/directMessageThread/getDirectMessageThreadMessageConnection';
import type { GetUserType } from '../../../../shared/graphql/queries/user/getUser';
import sendDirectMessage from '../../../../shared/graphql/mutations/message/sendDirectMessage';

import type { DirectMessageThreadInfoType } from '../../../../shared/graphql/fragments/directMessageThread/directMessageThreadInfo';

const DirectMessageThreadMessages = getDirectMessageThreadMessageConnection(
  Messages
);

type Props = {
  ...$Exact<ViewNetworkHandlerProps>,
  id: string,
  sendDirectMessage: Function,
  currentUser: GetUserType,
  data: {
    directMessageThread?: GetDirectMessageThreadType,
  },
};

const DirectMessageThread = (props: Props) => {
  const { isLoading, hasError, data: { directMessageThread } } = props;
  if (directMessageThread) {
    const sendMessage = text => {
      props.sendDirectMessage({
        threadId: directMessageThread.id,
        threadType: 'directMessageThread',
        messageType: 'text',
        content: {
          body: text,
        },
      });
    };
    return (
      <View style={{ flex: 1 }}>
        <DirectMessageThreadMessages id={directMessageThread.id} />
        <ChatInput onSubmit={sendMessage} />
      </View>
    );
  }

  if (isLoading) return <Text>Loading...</Text>;
  if (hasError) return <Text>Error :(</Text>;
  return null;
};

export default compose(
  ViewNetworkHandler,
  sendDirectMessage,
  getDirectMessageThread
)(DirectMessageThread);
