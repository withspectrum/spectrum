// @flow
import React from 'react';
import redraft from 'redraft';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import TouchableOpacity from '../TouchableOpacity';
import { connectActionSheet } from '@expo/react-native-action-sheet';
import Text from '../Text';
import ConditionalWrap from '../ConditionalWrap';
import { messageRenderer } from '../../../shared/clients/draft-js/message/renderer.native';
import { Bubble, TextWrapper, Align } from './style';
import { QuotedMessage } from './QuotedMessage';
import Reactions from './Reactions';
import { replyToMessage } from '../../../src/actions/message';
import toggleReaction from '../../../shared/graphql/mutations/reaction/toggleReaction';
import { draftOnlyContainsEmoji } from '../../../shared/only-contains-emoji';
import { toState, toPlainText } from '../../../shared/draft-utils';
import type { MessageInfoType } from '../../../shared/graphql/fragments/message/messageInfo';

type Props = {
  message: MessageInfoType,
  me: boolean,
  threadId?: string,
  bubble?: boolean,
  dispatch: Function,
  toggleReaction: ({ messageId: string, type: 'like' }) => Promise<any>,
  showActionSheetWithOptions: Function,
};

type State = {
  message: MessageInfoType,
};

class Message extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      message: props.message,
    };
  }

  onPress = () => {
    if (!this.props.threadId) return;
    const { message } = this.state;
    const { showActionSheetWithOptions, dispatch, threadId } = this.props;
    showActionSheetWithOptions(
      {
        options: [
          'Quote',
          message.reactions.hasReacted ? 'Unlike' : 'Like',
          'Cancel',
        ],
        cancelButtonIndex: 2,
      },
      pressedIndex => {
        switch (pressedIndex) {
          case 0: {
            dispatch(
              replyToMessage({ threadId: threadId, messageId: message.id })
            );
            return;
          }
          case 1: {
            this.setState(({ message }) => ({
              message: {
                ...message,
                reactions: {
                  count: message.reactions.hasReacted
                    ? message.reactions.count - 1
                    : message.reactions.count + 1,
                  hasReacted: !message.reactions.hasReacted,
                },
              },
            }));
            toggleReaction({ messageId: message.id, type: 'like' });
            return;
          }
        }
      }
    );
  };

  render() {
    console.log('rendering message');
    const { message } = this.state;
    const {
      me,
      bubble,
      showActionSheetWithOptions,
      dispatch,
      threadId,
      toggleReaction,
    } = this.props;
    const emojiOnly =
      message.messageType === 'draftjs'
        ? draftOnlyContainsEmoji(JSON.parse(message.content.body))
        : false;
    if (emojiOnly) {
      return (
        <ConditionalWrap
          condition={bubble !== false}
          wrap={children => (
            <Align me={me}>
              {me && (
                <Reactions style={{ marginRight: 8 }} {...message.reactions} />
              )}
              {children}
              {!me && (
                <Reactions style={{ marginLeft: 8 }} {...message.reactions} />
              )}
            </Align>
          )}
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
        return (
          <ConditionalWrap
            condition={bubble !== false}
            wrap={children => (
              <TouchableOpacity onPress={this.onPress}>
                <Align me={me}>
                  {me && (
                    <Reactions
                      style={{ marginRight: 8 }}
                      {...message.reactions}
                    />
                  )}
                  <Bubble me={me}>
                    {message.parent ? (
                      /* $FlowIssue */
                      <QuotedMessage message={message.parent} />
                    ) : null}
                    <TextWrapper>{children}</TextWrapper>
                  </Bubble>
                  {!me && (
                    <Reactions
                      style={{ marginLeft: 8 }}
                      {...message.reactions}
                    />
                  )}
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
  }
}

export default compose(connectActionSheet, toggleReaction, connect())(Message);
