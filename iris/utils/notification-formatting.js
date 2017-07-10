//@flow
import createEmojiRegex from 'emoji-regex';
// This regex matches every string with any emoji in it, not just strings that only have emojis
const originalEmojiRegex = createEmojiRegex();
// Make sure we match strings that only contain emojis (and whitespace)
const regex = new RegExp(
  `^(${originalEmojiRegex.toString().replace(/\/g$/, '')}|\\s)+$`
);
export const onlyContainsEmoji = (text: string) => regex.test(text);

export const getDistinctNotifications = array => {
  let unique = {};
  let distinct = [];
  for (let i in array) {
    if (typeof unique[array[i].id] === 'undefined') {
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

const actorsToString = actors => {
  // reverse to show the most recent first
  const names =
    actors &&
    actors.length > 0 &&
    actors.map(actor => JSON.parse(actor.payload).name).reverse();

  if (actors.length === 1) {
    return names[0];
  } else if (actors.length === 2) {
    return `${names[0]} and ${names[1]}`;
  } else if (actors.length === 3) {
    return `${names[0]}, ${names[1]} and ${names[2]}`;
  } else {
    return `${names[0]} and ${names.length - 1} others`;
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
      return 'replied';
    }
    case 'REACTION_CREATED': {
      return 'liked';
    }
    case 'CHANNEL_CREATED': {
      return 'created a channel';
    }
    case 'USER_JOINED_COMMUNITY': {
      return 'joined';
    }
    default: {
      console.log('Not a valid event type');
    }
  }
};

const threadToString = (context, currentUser) => {
  const payload = JSON.parse(context.payload);
  const isCreator = payload.creatorId === currentUser.id;
  const str = isCreator ? 'in your thread' : 'in';
  return `${str} ${payload.content.title}`;
};

const messageToString = () => 'your reply';

const communityToString = context => {
  return `${JSON.parse(context.payload).name}`;
};

const channelToString = context => {
  return `${JSON.parse(context.payload).name}`;
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
    case 'CHANNEL': {
      const asString = channelToString(context);
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
    entity => JSON.parse(entity.payload).senderId !== currentUser.id
  );
  return JSON.parse(filteredMessages[filteredMessages.length - 1].payload);
};
