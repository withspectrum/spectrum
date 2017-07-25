//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';

import Icon from '../components/icons';
import { HorizontalRuleWithIcon } from '../components/globals';
import { ChatMessage } from '../views/notifications/style';

const icons = {
  NEW_THREAD: 'post',
  NEW_MESSAGE: 'messages',
  default: 'notification',
};

const colors = {
  NEW_THREAD: 'success.default',
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
  const { type, sender, community, channel, thread } = notification;
  switch (type) {
    case 'NEW_THREAD':
      return (
        <span>
          <Link to={`/@${sender.username}`}>{sender.name}</Link> posted a new
          thread in{' '}
          <Link to={`/${community.slug}/${channel.slug}`}>
            {community.name}/{channel.name}
          </Link>
          :
        </span>
      );
    case 'NEW_MESSAGE':
      return (
        <span>
          <Link to={`/@${sender.username}`}>{sender.name}</Link> replied to your{' '}
          <Link to={`?thread=${thread.id}`}>thread</Link>:
        </span>
      );
    default:
      return;
  }
};

export const constructLinklessMessage = notification => {
  const { type, sender, community, channel } = notification;
  switch (type) {
    case 'NEW_THREAD':
      return (
        <span>
          <b>{sender.name}</b> posted a new thread in{' '}
          <b>
            {community.name}/{channel.name}
          </b>
        </span>
      );
    case 'NEW_MESSAGE':
      return (
        <span>
          <b>{sender.name}</b> replied to your <b>thread</b>
        </span>
      );
    default:
      return;
  }
};

export const constructContent = notification => {
  const { type, sender, content } = notification;
  switch (type) {
    case 'NEW_THREAD':
      return (
        <p>
          {content.excerpt}
        </p>
      );
    case 'NEW_MESSAGE':
      return (
        <div>
          <HorizontalRuleWithIcon>
            <hr />
            <Icon glyph={'messages'} />
            <hr />
          </HorizontalRuleWithIcon>
          <ChatMessage data-from={sender.name}>
            {content.excerpt}
          </ChatMessage>
        </div>
      );
    default:
      return;
  }
};
