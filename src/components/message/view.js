// @flow
import React from 'react';
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
  QuotedParagraph,
} from './style';
import { messageRenderer } from 'shared/clients/draft-js/message/renderer.web';
import { toPlainText, toState } from 'shared/draft-utils';
import { onlyContainsEmoji } from '../../helpers/utils';
import { Byline, Name, Username } from '../messageGroup/style';
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
  const WrapperComponent = bubble ? Text : QuotedParagraph;
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
                  <Icon glyph="reply" size={16} />
                  <Name>{message.parent.author.user.name}</Name>
                  <Username>@{message.parent.author.user.username}</Username>
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

type ActionProps = {
  me: boolean,
  action: string,
  deleteMessage?: Function,
  replyToMessage?: Function,
};

const Action = (props: ActionProps) => {
  const { me, action, deleteMessage, replyToMessage } = props;

  switch (action) {
    case 'share':
    default:
      return (
        <ActionWrapper>
          <Icon glyph="share" tipText={'Share'} tipLocation={'top'} size={24} />
        </ActionWrapper>
      );
    case 'reply':
      return (
        <ActionWrapper>
          <Icon
            glyph="reply"
            tipText={`Reply`}
            tipLocation={'top'}
            size={24}
            onClick={replyToMessage}
          />
        </ActionWrapper>
      );
    case 'delete':
      return (
        <ModActionWrapper me={me}>
          <Icon
            glyph="delete"
            tipText={'Delete'}
            tipLocation={'top'}
            size={24}
            onClick={deleteMessage}
          />
        </ModActionWrapper>
      );
  }
};

export const Actions = (props: {
  me: boolean,
  canModerate: boolean,
  deleteMessage?: Function,
  replyToMessage?: Function,
  isOptimisticMessage: boolean,
  children: Node,
  message: Object,
}) => {
  const {
    me,
    canModerate,
    deleteMessage,
    replyToMessage,
    isOptimisticMessage,
    message,
  } = props;

  if (isOptimisticMessage && message.messageType === 'media') {
    return null;
  }

  return (
    <ActionUI me={me}>
      {props.children}
      <Action me={me} action="reply" replyToMessage={replyToMessage} />
      {canModerate &&
        !isOptimisticMessage && (
          <Action me={me} action={'delete'} deleteMessage={deleteMessage} />
        )}
      <Indicator me={me} />
    </ActionUI>
  );
};

export const Timestamp = (props: { me: boolean, time: string }) => (
  <Time me={props.me}>{props.time}</Time>
);
