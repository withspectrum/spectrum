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
  Line,
  Paragraph,
} from './style';
import mentionsDecorator from 'shared/clients/draft-js/mentions-decorator/index.web.js';
import linksDecorator from 'shared/clients/draft-js/links-decorator';

const codeRenderer = {
  blocks: {
    'code-block': (children, { keys }) => (
      <Line key={keys[0]}>
        {children.map((child, i) => [child, <br key={i} />])}
      </Line>
    ),
  },
};

const messageRenderer = {
  blocks: {
    unstyled: (children, { keys }) =>
      children.map((child, index) => (
        <Paragraph key={keys[index] || index}>{child}</Paragraph>
      )),
  },
  decorators: [mentionsDecorator, linksDecorator],
};

export const Body = props => {
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

export const Actions = props => {
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

export const Timestamp = props => <Time me={props.me}>{props.time}</Time>;
