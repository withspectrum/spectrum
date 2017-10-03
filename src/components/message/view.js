import React from 'react';
import replace from 'string-replace-to-array';
import {
  convertTimestampToTime,
  onlyContainsEmoji,
  renderMarkdownLinks,
} from '../../helpers/utils';
import { Flyout } from '../flyout';
import {
  Text,
  Emoji,
  Image,
  ActionUI,
  Indicator,
  ModeratorActions,
  Action,
  Time,
} from './style';

export const Body = props => {
  const { imgSrc, message, openGallery, pending, type } = props;

  // probably needs handling in case message.messageType doesn't exist for some reason... although the switch's default case should handle most errors and just output the text contents of the message object.

  switch (type) {
    case 'text':
    default:
      return <Text pending={pending}>{renderMarkdownLinks(message.body)}</Text>;
    case 'emoji':
      return <Emoji pending={pending}>{message.body}</Emoji>;
    case 'media':
      return (
        <Image
          onClick={openGallery}
          pending={pending}
          src={`${message.content.body}${pending
            ? ''
            : `?max-w=${window.innerWidth * 0.6}`}`}
        />
      );
  }
};

export const Actions = props => {
  const { me, reaction, toggleReaction, shareable, canModerate } = props;

  return (
    <ActionUI>
      <Indicator reaction={reaction} />
      <Flyout>
        {/* This takes the default reaction for this postType. Defaults to 'like' */}
        <Action action={reaction.type} />
        {shareable && <Action action={'share'} />}
        {canModerate && (
          <ModeratorActions>
            <Action action={'delete'} />
          </ModeratorActions>
        )}
      </Flyout>
    </ActionUI>
  );
};

export const Timestamp = props => <Time>{props.time}</Time>;
