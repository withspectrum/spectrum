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
  QuoteWrapper,
} from './style';
import { Byline } from '../messageGroup/style';
import mentionsDecorator from 'src/components/draftjs-editor/mentions-decorator';
import linksDecorator from 'src/components/draftjs-editor/links-decorator';

const codeRenderer = {
  blocks: {
    'code-block': (children, { keys }) => (
      <Line key={keys[0]}>{children.map(child => [child, <br />])}</Line>
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
  const { message, openGallery, pending, type, me } = props;

  // All messages use a type. Legacy messages use that type to determine styling, but new ones all use the 'draftjs' type and are subdivided by 'messageType'
  switch (type) {
    case 'text':
    default:
      return (
        <Text me={me} pending={pending}>
          {message.body}
        </Text>
      );
    case 'media':
      return (
        <Image
          onClick={openGallery}
          pending={pending}
          src={`${message.body}${pending
            ? ''
            : `?max-w=${window.innerWidth * 0.6}`}`}
        />
      );
    case 'emoji':
      return <Emoji pending={pending}>{message}</Emoji>;
    case 'draftjs':
      const body = JSON.parse(message.body);
      const messageType = body.blocks[0].type;

      if (messageType === 'code-block') {
        return <Code pending={pending}>{redraft(body, codeRenderer)}</Code>;
      }

      if (messageType === 'reply') {
        return <Text>{redraft(body, messageRenderer)}</Text>;
      }

      return (
        <Text me={me} pending={pending}>
          {redraft(body, messageRenderer)}
        </Text>
      );
  }
};

const Quote = ({ data: { message }, parsedMessage }) => (
  <QuoteWrapper>
    <Byline>{message.sender}</Byline>
    {/* <Body
      id={message.id}
      type={emojiOnly ? 'text' : message.messageType}
      openGallery={() => this.toggleOpenGallery(message.id)}
      message={emojiOnly ? parsedMessage : message.content}
    /> */}
  </QuoteWrapper>
);

const Action = props => {
  const { me, action, deleteMessage } = props;

  switch (action) {
    case 'share':
    default:
      return (
        <ActionWrapper>
          <Icon glyph="share" tipText={`Share`} tipLocation={'top'} size={20} />
        </ActionWrapper>
      );
    case 'delete':
      return (
        <ModActionWrapper me={me}>
          <Icon
            glyph="delete"
            tipText={`Delete`}
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
    // toggleReaction,
    // shareable,
    canModerate,
    deleteMessage,
    hideIndicator,
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
      {hideIndicator ||
        (!isOptimisticMessage && <Indicator reaction={reaction} me={me} />)}
    </ActionUI>
  );
};

export const Timestamp = props => <Time me={props.me}>{props.time}</Time>;
