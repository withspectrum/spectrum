//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';

import Icon from '../components/icons';
import { HorizontalRuleWithIcon } from '../components/globals';
import { ChatMessage } from '../views/notifications/style';

const icons = {
  NEW_STORY: 'post',
  NEW_MESSAGE: 'messages',
  default: 'notification',
};

const colors = {
  NEW_STORY: 'success.default',
  NEW_MESSAGE: 'warn.alt',
};

export const getIconByType = type => {
  return icons[type] || icons.default;
};

export const getColorByType = type => {
  // TODO: add "readState" handling to change color to light gray
  return colors[type];
};

export const constructMessage = notification => {
  const { type, sender, community, frequency, story } = notification;
  switch (type) {
    case 'NEW_STORY':
      return (
        <span>
          <Link to={`/@${sender.username}`}>{sender.displayName}</Link>
          {' '}posted a new thread in{' '}
          <Link to={`/${community.slug}/${frequency.slug}`}>
            {community.name}/{frequency.name}
          </Link>
          :
        </span>
      );
    case 'NEW_MESSAGE':
      return (
        <span>
          <Link to={`/@${sender.username}`}>{sender.displayName}</Link>
          {' '}replied to your{' '}
          <Link to={`/story/${story.id}`}>thread</Link>:
        </span>
      );
    default:
      return;
  }
};

export const constructLinklessMessage = notification => {
  const { type, sender, community, frequency } = notification;
  switch (type) {
    case 'NEW_STORY':
      return (
        <span>
          <b>{sender.displayName}</b>
          {' '}posted a new thread in{' '}
          <b>{community.name}/{frequency.name}</b>
        </span>
      );
    case 'NEW_MESSAGE':
      return (
        <span>
          <b>{sender.displayName}</b>
          {' '}replied to your{' '}
          <b>thread</b>
        </span>
      );
    default:
      return;
  }
};

export const constructContent = notification => {
  const { type, sender, content } = notification;
  switch (type) {
    case 'NEW_STORY':
      return <p>{content.excerpt}</p>;
    case 'NEW_MESSAGE':
      return (
        <div>
          <HorizontalRuleWithIcon>
            <hr />
            <Icon glyph={'messages'} />
            <hr />
          </HorizontalRuleWithIcon>
          <ChatMessage data-from={sender.displayName}>
            {content.excerpt}
          </ChatMessage>
        </div>
      );
    default:
      return;
  }
};
