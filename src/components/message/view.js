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
} from './style';
import { Byline } from '../messageGroup/style';
import { messageRenderer } from 'shared/clients/draft-js/message/renderer.web';
import type { Node } from 'react';

export const Body = (props: {
  me: boolean,
  type: 'text' | 'media' | 'emoji' | 'draftjs',
  openGallery: Function,
  message: Object,
  data: Object,
  showQuoted?: boolean,
}) => {
  const { message, openGallery, type, me, data, showQuoted } = props;
  switch (type) {
    case 'text':
    default:
      return <Text me={me}>{message.body}</Text>;
    case 'media': {
      // don't apply imgix url params to optimistic image messages
      const src = props.id
        ? message.body
        : `${message.body}?max-w=${window.innerWidth * 0.6}`;
      if (typeof data.id === 'number' && data.id < 0) {
        return null;
      }
      return <Image onClick={openGallery} src={src} />;
    }
    case 'emoji':
      return <Emoji>{message}</Emoji>;
    case 'draftjs': {
      return (
        <Text me={me}>
          {message.quotedMessage && showQuoted !== false && <Quote message={message.quotedMessage} />}
          {redraft(JSON.parse(message.body), messageRenderer)}
        </Text>
      );
    }
  }
};

const Quote = ({ message }) => (
  <QuoteWrapper>
    <Byline>{message.sender}</Byline>
    <Body
      id={message.id}
      // type={emojiOnly ? 'text' : message.messageType}
      // message={emojiOnly ? parsedMessage : message.content}
      type={message.messageType}
      message={message.content}
      data={message}
      openGallery={() => {}}
      showQuoted={false}
    />
  </QuoteWrapper>
);

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
    case 'reply':
      return (
        <ActionWrapper>
          <Icon glyph="reply" tipText={`Reply`} tipLocation={'top'} size={20} />
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
    quotable,
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
      {quotable && <Action me={me} action={'reply'} />}
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
