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
  Code,
} from './style';
import {
  codeRenderer,
  messageRenderer,
} from 'shared/clients/draft-js/message/renderer.web';
import type { Node } from 'react';

export const Body = (props: {
  me: boolean,
  type: 'text' | 'media' | 'emoji' | 'draftjs',
  openGallery: Function,
  message: Object,
}) => {
  const { message, openGallery, type, me } = props;
  switch (type) {
    case 'text':
    default:
      return <Text me={me}>{message.body}</Text>;
    case 'media':
      // don't apply imgix url params to optimistic image messages
      const src = props.id
        ? message.body
        : `${message.body}?max-w=${window.innerWidth * 0.6}`;
      return <Image onClick={openGallery} src={src} />;
    case 'emoji':
      return <Emoji>{message}</Emoji>;
    case 'draftjs':
      const body = JSON.parse(message.body);
      const isCode = body.blocks[0].type === 'code-block';

      if (isCode) {
        return <Code>{redraft(body, codeRenderer)}</Code>;
      } else {
        return <Text me={me}>{redraft(body, messageRenderer)}</Text>;
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
}) => {
  const {
    me,
    reaction,
    canModerate,
    deleteMessage,
    isOptimisticMessage,
  } = props;

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
