//@flow
import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { timeDifferenceShort } from '../../helpers/utils';
import { Timestamp } from './style';
import {
  AvatarLabel,
  UserAvatar,
  Byline,
  Name,
  Badge,
} from '../../components/chatMessages/style';

export const getDistinctNotifications = array => {
  let unique = {};
  let distinct = [];
  for (let i in array) {
    if (typeof unique[array[i].id] == 'undefined') {
      distinct.push(array[i]);
    }
    unique[array[i].id] = 0;
  }
  return distinct;
};

export const parseNotification = notification => {
  return Object.assign({}, notification, {
    actors: notification.actors.map(actor => {
      return {
        id: actor.id,
        type: actor.type,
        payload: JSON.parse(actor.payload),
      };
    }),
    context: {
      id: notification.context.id,
      type: notification.context.type,
      payload: JSON.parse(notification.context.payload),
    },
    entities: notification.entities.map(entity => {
      return {
        id: entity.id,
        type: entity.type,
        payload: JSON.parse(entity.payload),
      };
    }),
  });
};

export const renderBubbleHeader = actor => (
  <Byline>
    <Link to={`/users/${actor.username}`}>
      <Name>{actor.name}</Name>
      {actor.isAdmin && <Badge type="admin" />}
      {actor.isPro && <Badge type="pro" />}
    </Link>
  </Byline>
);

export const renderAvatar = actor => (
  <Link to={`/users/${actor.username}`} style={{ alignSelf: 'flex-end' }}>
    <AvatarLabel tipText={actor.name} tipLocation="right">
      <UserAvatar isOnline={actor.isOnline} src={actor.profilePhoto} />
    </AvatarLabel>
  </Link>
);

const actorsToString = actors => {
  // reverse to show the most recent first
  const names =
    actors &&
    actors.length > 0 &&
    actors.map(actor => actor.payload.name).reverse();
  const data =
    actors && actors.length > 0 && actors.map(actor => actor.payload).reverse();

  if (actors.length === 1) {
    return (
      <span>
        <Link to={`/users/${data[0].username}`}>
          {`${names[0]}`}
        </Link>
      </span>
    );
  } else if (actors.length === 2) {
    return (
      <span>
        <Link to={`/users/${data[0].username}`}>
          {`${names[0]}`}
        </Link>
        {' '}
        and
        {' '}
        <Link to={`/users/${data[1].username}`}>
          {`${names[1]}`}
        </Link>
      </span>
    );
  } else if (actors.length === 3) {
    return (
      <span>
        <Link to={`/users/${data[0].username}`}>
          {`${names[0]}`}
        </Link>
        ,
        {' '}
        <Link to={`/users/${data[1].username}`}>
          {`${names[1]}`}
        </Link>
        {' '}
        and
        {' '}
        <Link to={`/users/${data[2].username}`}>
          {`${names[2]}`}
        </Link>
      </span>
    );
  } else {
    return (
      <span>
        <Link to={`/users/${data[0].username}`}>
          {`${names[0]}`}
        </Link>
        {' '}
        and {names.length - 1} others{' '}
      </span>
    );
  }
};

const actorsToObjects = actors => {
  return (
    actors &&
    actors.length > 0 &&
    actors
      .map(actor => {
        return {
          name: actor.payload.name,
          username: actor.payload.username,
          profilePhoto: actor.payload.profilePhoto,
          id: actor.payload.id,
        };
      })
      .reverse()
  );
};

export const parseActors = (actors, currentUser) => {
  const filteredActors = actors.filter(actor => actor.id !== currentUser.id);
  const asString = actorsToString(filteredActors);
  const asObjects = actorsToObjects(filteredActors);

  return {
    asString,
    asObjects,
  };
};

export const parseEvent = event => {
  switch (event) {
    case 'MESSAGE_CREATED': {
      return <span>replied</span>;
    }
    case 'REACTION_CREATED': {
      return <span>liked</span>;
    }
    case 'CHANNEL_CREATED': {
      return <span>created a channel</span>;
    }
    case 'USER_JOINED_COMMUNITY': {
      return <span>joined</span>;
    }
    default: {
      console.log('Not a valid event type');
    }
  }
};

// parse date => modifiedAt to timeAgo
export const parseNotificationDate = date => {
  const now = new Date().getTime();
  const timestamp = new Date(date).getTime();
  return <Timestamp>· {timeDifferenceShort(now, timestamp)}</Timestamp>;
};

const threadToString = (context, currentUser) => {
  console.log('context', context);
  console.log('currentUser', currentUser);
  const isCreator = context.payload.creatorId === currentUser.id;
  const str = isCreator ? 'in your thread' : 'in';
  return (
    <span>
      {' '}
      {str}
      {' '}
      <Link to={`/thread/${context.payload.id}`}>
        {context.payload.content.title}
      </Link>
    </span>
  );
};

const messageToString = context => {
  return (
    <span>
      {' '}your reply
    </span>
  );
};

const communityToString = context => {
  return (
    <span>
      {' '}
      <Link to={`/${context.payload.slug}`}>{context.payload.name}</Link>
    </span>
  );
};

export const parseContext = (context, currentUser) => {
  switch (context.type) {
    case 'SLATE':
    case 'THREAD': {
      const asString = threadToString(context, currentUser);
      return {
        asString,
      };
    }
    case 'MESSAGE': {
      const asString = messageToString(context);
      return {
        asString,
      };
    }
    case 'COMMUNITY': {
      const asString = communityToString(context);
      return {
        asString,
      };
    }
    default: {
      console.log('Invalid notification context type');
    }
  }
};

export const getLastMessageCreatedByAnotherUser = (entities, currentUser) => {
  const filteredMessages = entities.filter(
    entity => entity.payload.senderId !== currentUser.id
  );
  return filteredMessages[filteredMessages.length - 1].payload;
};
