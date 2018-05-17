// @flow
import React from 'react';
import redraft from 'redraft';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import Text from '../Text';
import { messageRenderer } from '../../../shared/clients/draft-js/message/renderer.native';
import { Bubble, TextWrapper } from './style';
import { QuotedMessage } from './QuotedMessage';
import { replyToMessage } from '../../../src/actions/message';
import type { MessageInfoType } from '../../../shared/graphql/fragments/message/messageInfo';

type Props = {
  message: MessageInfoType,
  me: boolean,
  threadId?: string,
  bubble?: boolean,
  dispatch: Function,
  showActionSheetWithOptions: Function,
};

const Message = ({
  message,
  me,
  bubble,
  showActionSheetWithOptions,
  dispatch,
  threadId,
}: Props) => {
  let body =
    message.messageType === 'draftjs'
      ? redraft(JSON.parse(message.content.body), messageRenderer)
      : message.content.body;
  switch (message.messageType) {
    // case 'media': {
    //   // don't apply imgix url params to optimistic image messages
    //   const src = props.id
    //     ? message.body
    //     : `${message.body}?max-w=${window.innerWidth * 0.6}`;
    //   if (typeof data.id === 'number' && data.id < 0) {
    //     return null;
    //   }
    //   return <Image onClick={openGallery} src={src} />;
    // }
    // case 'emoji':
    //   return <Text type="body">{message.content.body}</Text>;
    case 'text':
    case 'draftjs': {
      if (bubble !== false) {
        const onPress = () =>
          threadId &&
          showActionSheetWithOptions(
            {
              options: ['Quote', 'Cancel'],
              cancelButtonIndex: 1,
            },
            pressedIndex => {
              if (pressedIndex === 0) {
                dispatch(
                  replyToMessage({ threadId: threadId, messageId: message.id })
                );
              }
            }
          );
        return (
          <TouchableOpacity onPress={onPress}>
            <Bubble me={me}>
              {/* $FlowIssue */}
              {message.parent ? (
                <QuotedMessage message={message.parent} />
              ) : null}
              <TextWrapper>
                <Text color={me ? '#FFFFFF' : '#000000'}>{body}</Text>
              </TextWrapper>
            </Bubble>
          </TouchableOpacity>
        );
      }
      return <Text color={me ? '#FFFFFF' : '#000000'}>{body}</Text>;
    }
    default:
      return null;
  }
};

export default compose(connectActionSheet, connect())(Message);
