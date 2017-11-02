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
import { toState, toPlainText } from 'shared/draft-utils';
import { renderLinks } from 'src/helpers/utils';
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
      const isCode = body.blocks[0].type === 'code-block';

      if (isCode) {
        return <Code pending={pending}>{redraft(body, codeRenderer)}</Code>;
      } else {
        return (
          <Text me={me} pending={pending}>
            {redraft(body, messageRenderer)}
          </Text>
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
  } = props;

  return (
    <ActionUI me={me}>
      {props.children}
      {/* {props.shareable && <Action me={me} action={'share'} /> } */}
      {canModerate && (
        <Action me={me} action={'delete'} deleteMessage={deleteMessage} />
      )}
      {hideIndicator || <Indicator reaction={reaction} me={me} />}
    </ActionUI>
  );
};

export const Timestamp = props => <Time me={props.me}>{props.time}</Time>;
