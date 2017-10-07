import React from 'react';
import replace from 'string-replace-to-array';
import {
  convertTimestampToTime,
  onlyContainsEmoji,
  renderLinks,
} from '../../helpers/utils';
import { toPlainText, toState } from 'shared/draft-utils';
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
} from './style';

export const Body = props => {
  const { message, openGallery, pending, type, me } = props;

  // probably needs handling in case message.messageType doesn't exist for some reason... although the switch's default case should handle most errors and just output the text contents of the message object.

  switch (type) {
    case 'draftjs':
    case 'text':
    default:
      const body =
        type === 'draftjs'
          ? toPlainText(toState(JSON.parse(message.body)))
          : message.body;
      return (
        <Text me={me} pending={pending}>
          {renderLinks(body)}
        </Text>
      );
    case 'emoji':
      return <Emoji pending={pending}>{message.body}</Emoji>;
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
    toggleReaction,
    shareable,
    canModerate,
    deleteMessage,
    hideIndicator,
  } = props;

  return (
    <ActionUI me={me}>
      {props.children}
      {/* {shareable && <Action me={me} action={'share'} /> } */}
      {canModerate && (
        <Action me={me} action={'delete'} deleteMessage={deleteMessage} />
      )}
      {hideIndicator || <Indicator reaction={reaction} me={me} />}
    </ActionUI>
  );
};

export const Timestamp = props => <Time me={props.me}>{props.time}</Time>;
