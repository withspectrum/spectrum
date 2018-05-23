// @flow
import React, { Fragment } from 'react';
import { View } from 'react-native';
import compose from 'recompose/compose';
import { Query } from 'react-apollo';
import Text from '../../../components/Text';
import ChatInput from '../../../components/ChatInput';
import Messages from '../../../components/Messages';
import Avatar from '../../../components/Avatar';
import Column from '../../../components/Flex/Column';
import Row from '../../../components/Flex/Row';
import ViewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../../components/ViewNetworkHandler';

import sentencify from '../../../../shared/sentencify';
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

class DirectMessageThread extends React.Component<Props> {
  sendMessage = text => {
    if (!this.props.data.directMessageThread) return;
    this.props.sendDirectMessage({
      threadId: this.props.data.directMessageThread.id,
      threadType: 'directMessageThread',
      messageType: 'text',
      content: {
        body: text,
      },
    });
  };

  render() {
    const {
      isLoading,
      hasError,
      data: { directMessageThread },
      currentUser,
    } = this.props;

    if (directMessageThread) {
      const participants = directMessageThread.participants.filter(
        ({ userId }) => userId !== currentUser.id
      );
      return (
        <View style={{ flex: 1 }}>
          <Column
            style={{
              alignItems: 'center',
              marginTop: 32,
              marginBottom: 32,
              marginRight: 8,
              marginLeft: 8,
            }}
          >
            <Row>
              {participants.map(({ profilePhoto, id }) => (
                <Avatar
                  src={profilePhoto}
                  key={id}
                  size={60}
                  style={{ marginRight: 4, marginLeft: 4 }}
                />
              ))}
            </Row>
            <Text type="title3" bold>
              {sentencify(participants.map(({ name }) => name))}
            </Text>
          </Column>
          <DirectMessageThreadMessages id={directMessageThread.id} />
          <ChatInput onSubmit={this.sendMessage} />
        </View>
      );
    }

    if (isLoading) return <Text>Loading...</Text>;
    if (hasError) return <Text>Error :(</Text>;
    return null;
  }
}

export default compose(
  ViewNetworkHandler,
  sendDirectMessage,
  getDirectMessageThread
)(DirectMessageThread);
