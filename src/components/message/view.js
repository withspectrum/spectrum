// @flow
import React, { Fragment } from 'react';
import redraft from 'redraft';
import Icon from '../icons';
import {
  Text,
  Emoji,
  Image,
  ActionUI,
  Indicator,
  ActionWrapper,
  ModActionWrapper,
  Time,
  QuoteWrapper,
  Paragraph,
} from './style';
import { messageRenderer } from 'shared/clients/draft-js/message/renderer.web';
import { toPlainText, toState } from 'shared/draft-utils';
import { onlyContainsEmoji } from '../../helpers/utils';
import { Byline } from '../messageGroup/style';
import type { Node } from 'react';
import type { MessageInfoType } from 'shared/graphql/fragments/message/messageInfo.js';

export const Body = (props: {
  openGallery: Function,
  me: boolean,
  message: MessageInfoType,
  bubble?: boolean,
  showParent?: boolean,
}) => {
  const { showParent = true, message, openGallery, me, bubble = true } = props;
  const parsedMessage =
    message.messageType &&
    message.messageType === 'draftjs' &&
    toPlainText(toState(JSON.parse(message.content.body)));
  const emojiOnly = parsedMessage && onlyContainsEmoji(parsedMessage);
  if (emojiOnly) return <Emoji>{parsedMessage}</Emoji>;
  const WrapperComponent = bubble ? Text : Paragraph;
  switch (message.messageType) {
    case 'text':
    default:
      return (
        <WrapperComponent me={me}>{message.content.body}</WrapperComponent>
      );
    case 'media': {
      // don't apply imgix url params to optimistic image messages
      const src = props.id
        ? message.content.body
        : `${message.content.body}?max-w=${window.innerWidth * 0.6}`;
      if (typeof message.id === 'number' && message.id < 0) {
        return null;
      }
      return <Image onClick={openGallery} src={src} />;
    }
    case 'draftjs': {
      return (
        <WrapperComponent me={me}>
          {message.parent &&
            showParent && (
              <QuoteWrapper>
                <Byline>
                  {message.parent.author.user.name} @{
                    message.parent.author.user.username
                  }
                </Byline>
                <Body
                  // $FlowIssue
                  message={message.parent}
                  showParent={false}
                  me={false}
                  openGallery={openGallery}
                  bubble={false}
                />
              </QuoteWrapper>
            )}
          {redraft(JSON.parse(message.content.body), messageRenderer)}
        </WrapperComponent>
      );
    }
  }
};

const Action = props => {
  const { me, action, deleteMessage } = props;

  switch (action) {
    case 'share':
    default:
      return (
        <ActionWrapper>
          <Icon glyph="share" tipText={'Share'} tipLocation={'top'} size={20} />
        </ActionWrapper>
      );
    case 'delete':
      return (
        <ModActionWrapper me={me}>
          <Icon
            glyph="delete"
            tipText={'Delete'}
            tipLocation={'top'}
            size={20}
            onClick={deleteMessage}
          />
        </ModActionWrapper>
      );
  }
};

export const Actions = (props: {
  me: boolean,
  reaction: Object,
  canModerate: boolean,
  deleteMessage: Function,
  isOptimisticMessage: boolean,
  children: Node,
  message: Object,
}) => {
  const {
    me,
    reaction,
    canModerate,
    deleteMessage,
    isOptimisticMessage,
    message,
  } = props;

  if (isOptimisticMessage && message.messageType === 'media') {
    return null;
  }

  return (
    <ActionUI me={me}>
      {props.children}
      {/* {props.shareable && <Action me={me} action={'share'} /> } */}
      {canModerate &&
        !isOptimisticMessage && (
          <Action me={me} action={'delete'} deleteMessage={deleteMessage} />
        )}
      <Indicator reaction={reaction} me={me} />
    </ActionUI>
  );
};

export const Timestamp = (props: { me: boolean, time: string }) => (
  <Time me={props.me}>{props.time}</Time>
);
