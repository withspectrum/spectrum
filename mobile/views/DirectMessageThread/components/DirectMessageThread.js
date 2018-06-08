// @flow
import React, { Component } from 'react';
import { View } from 'react-native';
import compose from 'recompose/compose';
import Text from '../../../components/Text';
import ChatInput from '../../../components/ChatInput';
import Messages from '../../../components/Messages';
import Avatar from '../../../components/Avatar';
import Column from '../../../components/Flex/Column';
import { Row } from '../../../components/Flex';
import ViewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../../components/ViewNetworkHandler';
import Loading from '../../../components/Loading';
import ErrorBoundary from '../../../components/ErrorBoundary';

import sentencify from '../../../../shared/sentencify';
import getDirectMessageThread, {
  type GetDirectMessageThreadType,
} from '../../../../shared/graphql/queries/directMessageThread/getDirectMessageThread';
import getDirectMessageThreadMessageConnection from '../../../../shared/graphql/queries/directMessageThread/getDirectMessageThreadMessageConnection';
import type { GetUserType } from '../../../../shared/graphql/queries/user/getUser';
import sendDirectMessage from '../../../../shared/graphql/mutations/message/sendDirectMessage';
import type { NavigationProps } from 'react-navigation';
import { FullscreenNullState } from '../../../components/NullStates';

const DirectMessageThreadMessages = getDirectMessageThreadMessageConnection(
  Messages
);

type Props = {
  ...$Exact<ViewNetworkHandlerProps>,
  id: string,
  sendDirectMessage: Function,
  currentUser: GetUserType,
  navigation: NavigationProps,
  data: {
    directMessageThread?: GetDirectMessageThreadType,
  },
};

class DirectMessageThread extends Component<Props> {
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
      navigation,
    } = this.props;

    if (directMessageThread) {
      const participants = directMessageThread.participants.filter(
        ({ userId }) => userId !== currentUser.id
      );
      return (
        <View style={{ flex: 1 }}>
          <DirectMessageThreadMessages
            navigation={navigation}
            id={directMessageThread.id}
            ListHeaderComponent={() => (
              <ErrorBoundary fallbackComponent={null}>
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
              </ErrorBoundary>
            )}
          />

          <ErrorBoundary>
            <ChatInput onSubmit={this.sendMessage} />
          </ErrorBoundary>
        </View>
      );
    }

    if (isLoading) return <Loading />;
    if (hasError) return <FullscreenNullState />;

    return null;
  }
}

export default compose(
  ViewNetworkHandler,
  sendDirectMessage,
  getDirectMessageThread
)(DirectMessageThread);
