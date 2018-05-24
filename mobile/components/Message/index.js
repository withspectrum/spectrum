// @flow
import React from 'react';
import redraft from 'redraft';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { TouchableOpacity } from 'react-native';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import Text from '../Text';
import ConditionalWrap from '../ConditionalWrap';
import { messageRenderer } from '../../../shared/clients/draft-js/message/renderer.native';
import { Bubble, TextWrapper, Align } from './style';
import { QuotedMessage } from './QuotedMessage';
import { replyToMessage } from '../../../src/actions/message';
import { draftOnlyContainsEmoji } from '../../../shared/only-contains-emoji';
import { toState, toPlainText } from '../../../shared/draft-utils';
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
  const emojiOnly =
    message.messageType === 'draftjs'
      ? draftOnlyContainsEmoji(JSON.parse(message.content.body))
      : false;
  if (emojiOnly) {
    return (
      <ConditionalWrap
        condition={bubble !== false}
        wrap={children => <Align me={me}>{children}</Align>}
      >
        <Text
          type="body"
          style={{
            fontSize: 32,
            lineHeight: 34 /* Note(@mxstbr): magic number that makes sure emojis aren't cut off */,
          }}
        >
          {toPlainText(toState(JSON.parse(message.content.body)))}
        </Text>
      </ConditionalWrap>
    );
  }
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
    case 'text':
    case 'draftjs': {
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
        <ConditionalWrap
          condition={bubble !== false}
          wrap={children => (
            <TouchableOpacity onPress={onPress}>
              <Align me={me}>
                <Bubble me={me}>
                  {message.parent ? (
                    /* $FlowIssue */
                    <QuotedMessage message={message.parent} />
                  ) : null}
                  <TextWrapper>{children}</TextWrapper>
                </Bubble>
              </Align>
            </TouchableOpacity>
          )}
        >
          <Text
            color={me ? '#FFFFFF' : '#000000'}
            fontSize={emojiOnly ? 24 : undefined}
            style={{ marginTop: 0, marginBottom: 0 }}
          >
            {body}
          </Text>
        </ConditionalWrap>
      );
    }
    default:
      return null;
  }
};

export default compose(connectActionSheet, connect())(Message);
