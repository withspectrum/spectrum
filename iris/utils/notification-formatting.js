//@flow
import createEmojiRegex from 'emoji-regex';
// This regex matches every string with any emoji in it, not just strings that only have emojis
const originalEmojiRegex = createEmojiRegex();
// Make sure we match strings that only contain emojis (and whitespace)
const regex = new RegExp(
  `^(${originalEmojiRegex.toString().replace(/\/g$/, '')}|\\s)+$`
);
export const onlyContainsEmoji = (text: string) => regex.test(text);

export function timeDifferenceShort(current: Date, previous: Date) {
  const msPerSecond = 1000;
  const msPerMinute = 60 * 1000;
  const msPerHour = msPerMinute * 60;
  const msPerDay = msPerHour * 24;
  const msPerYear = msPerDay * 365;

  let elapsed = current - previous;

  if (elapsed < msPerMinute) {
    const now = Math.round(elapsed / msPerSecond);
    return `${now}s`;
  } else if (elapsed < msPerHour) {
    const now = Math.round(elapsed / msPerMinute);
    return `${now}m`;
  } else if (elapsed < msPerDay) {
    const now = Math.round(elapsed / msPerHour);
    return `${now}h`;
  } else if (elapsed < msPerYear) {
    const now = Math.round(elapsed / msPerDay);
    return `${now}d`;
  } else {
    const now = Math.round(elapsed / msPerYear);
    return `${now}y`;
  }
}

export const sortByDate = (array, key, order) => {
  return array.sort((a, b) => {
    const x = new Date(a[key]).getTime();
    const y = new Date(b[key]).getTime();
    // desc = older to newest from top to bottom
    const val = order === 'desc' ? y - x : x - y;
    return val;
  });
};

export const sortThreads = (entities, currentUser) => {
  // filter out the current user's threads
  let threads = entities
    .map(thread => ({
      ...thread,
      payload: JSON.parse(thread.payload),
    }))
    .filter(thread => thread.payload.creatorId !== currentUser.id);

  // create an array of payloads
  threads = threads && threads.map(thread => thread.payload);

  // sort the threads by created at date
  threads = threads && sortByDate(threads, 'createdAt', 'desc');

  return threads;
};

// parse date => modifiedAt to timeAgo
export const parseNotificationDate = date => {
  const now = new Date().getTime();
  const timestamp = new Date(date).getTime();
  return timeDifferenceShort(now, timestamp);
};

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

type Options = {
  max?: number,
  overflowPostfix?: string,
};

const defaultOptions = {
  max: 3,
  overflowPostfix: ' and others',
};

const LAST_COMMA = /,(?=[^,]*$)/;
// Sentencify an array of strings
export const sentencify = (
  strings: Array<string>,
  { max, overflowPostfix }: Options = defaultOptions
) => {
  // If we have more than three strings, only take the first 4
  const list = strings.length > max ? strings.slice(0, max) : strings;
  // ['Max Stoiber', 'Bryn Lovin', 'Bryn Jackson']
  // => 'Max Stoiber, Brian Lovin, Bryn Jackson'
  const sentence = list.join(', ');
  if (strings.length <= 1) return sentence;
  if (strings.length > max) return sentence + overflowPostfix;
  return sentence.replace(
    `, ${strings[strings.length - 1]}`,
    ` and ${strings[strings.length - 1]}`
  );
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
        asObject: {
          ...context,
          payload: JSON.parse(context.payload),
        },
      };
    }
    case 'COMMUNITY': {
      const asString = communityToString(context);
      return {
        asString,
        asObject: {
          ...context,
          payload: JSON.parse(context.payload),
        },
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

export const getMessages = (entities, currentUser) => {
  return entities
    .map(entity => ({
      ...entity,
      payload: JSON.parse(entity.payload),
    }))
    .filter(({ payload }) => payload.senderId !== currentUser.id);
};

const fs = require('fs');

const formatNotification = (notification, currentUserId) => {
  switch (notification.event) {
    case 'MESSAGE_CREATED': {
      const actors = parseActors(notification.actors, { id: currentUserId });
      const event = parseEvent(notification.event);
      const context = parseContext(notification.context, { id: currentUserId });
      const date = parseNotificationDate(notification.modifiedAt);
      const messages = getMessages(notification.entities, {
        id: currentUserId,
      });

      return {
        data: {
          href: `/thread/${notification.context.id}`,
        },
        title: `${actors.asString} ${event} ${context.asString}`,
        body: sentencify(
          messages.map(({ payload }) => `"${payload.content.body}"`)
        ),
        raw: {
          actors,
          event,
          context,
          entities: messages,
          date,
        },
      };
    }
    case 'REACTION_CREATED': {
      const actors = parseActors(notification.actors, { id: currentUserId });
      const event = parseEvent(notification.event);
      const date = parseNotificationDate(notification.modifiedAt);
      const context = parseContext(notification.context);
      const message = JSON.parse(notification.context.payload);

      return {
        data: {
          href: `/thread/${context.asObject.payload.threadId}`,
        },
        title: `${actors.asString} ${event} ${context.asString}`,
        body: message.content.body,
        raw: {
          actors,
          event,
          context,
          entity: message,
          date,
        },
      };
    }
    case 'CHANNEL_CREATED': {
      const date = parseNotificationDate(notification.modifiedAt);
      const context = parseContext(notification.context);
      const entities = notification.entities.map(entity => ({
        ...entity,
        payload: JSON.parse(entity.payload),
      }));
      const newChannelCount =
        entities.length > 1
          ? `${entities.length} new channels were`
          : 'A new channel was';

      return {
        title: `${newChannelCount} created in ${context.asObject.payload.name}`,
        body: sentencify(entities.map(({ payload }) => `"${payload.name}"`)),
        raw: {
          date,
          context,
          entities,
        },
      };
    }
    case 'USER_JOINED_COMMUNITY': {
      const actors = parseActors(notification.actors, { id: currentUserId });
      const event = parseEvent(notification.event);
      const date = parseNotificationDate(notification.modifiedAt);
      const context = parseContext(notification.context);

      return {
        data: {
          href: `/${context.asObject.payload.slug}`,
        },
        title: `${actors.asString} ${event} ${context.asString}`,
        raw: {
          actors,
          event,
          date,
          context,
        },
      };
    }
    case 'THREAD_CREATED': {
      const date = parseNotificationDate(notification.modifiedAt);
      const context = parseContext(notification.context);
      // sort and order the threads
      const threads = sortThreads(notification.entities, { id: currentUserId });

      const newThreadCount =
        threads.length > 1 ? `New threads were` : 'A new thread was';

      return {
        data: {
          href: `/thread/${threads[0].id}`,
        },
        title: `${newThreadCount} published in ${context.asString}`,
        body: sentencify(threads.map(thread => `"${thread.content.title}"`)),
        raw: {
          date,
          context,
          threads,
        },
      };
    }
    case 'COMMUNITY_INVITE': {
      const date = parseNotificationDate(notification.modifiedAt);
      const context = parseContext(notification.context);
      const actors = parseActors(notification.actors, { id: currentUserId });

      return {
        data: {
          href: `/${context.asObject.payload.slug}`,
        },
        title: `${actors.asString} invited you to join their community, ${context.asString}`,
        raw: {
          date,
          context,
          actors,
        },
      };
    }
    default: {
      return {};
    }
  }
};

export default formatNotification;
