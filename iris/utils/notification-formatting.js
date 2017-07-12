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
  let threads = entities.filter(
    thread => thread.payload.creatorId !== currentUser.id
  );
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

export const parseActors = (actors, currentUser) => {
  const filteredActors = actors
    .filter(actor => actor.id !== currentUser.id)
    .reverse();
  return sentencify(filteredActors.map(({ payload }) => payload.name));
};

const EVENT_VERB = {
  MESSAGE_CREATED: 'replied',
  REACTION_CREATED: 'liked',
  CHANNEL_CREATED: 'created in',
  USER_JOINED_COMMUNITY: 'joined',
};

export const contextToString = (context, currentUser) => {
  switch (context.type) {
    case 'SLATE':
    case 'THREAD': {
      const payload = context.payload;
      const isCreator = payload.creatorId === currentUser.id;
      const str = isCreator ? 'in your thread' : 'in';
      return `${str} ${payload.content.title}`;
    }
    case 'MESSAGE': {
      return 'your reply';
    }
    case 'COMMUNITY': {
      return context.payload.name;
    }
    case 'CHANNEL': {
      return context.payload.name;
    }
  }
};

const parsePayload = input => ({
  ...input,
  payload: JSON.parse(input.payload),
});

const parseEntityPayload = entities => entities.map(parsePayload);

const parseNotification = notification => {
  return {
    actors: notification.actors && parseEntityPayload(notification.actors),
    context: notification.context && parsePayload(notification.context),
    entities:
      notification.entities && parseEntityPayload(notification.entities),
    event: notification.event,
    date: notification.modifiedAt,
  };
};

const formatNotification = (incomingNotification, currentUserId) => {
  const notification = parseNotification(incomingNotification);

  const actors =
    notification.actors &&
    parseActors(notification.actors, { id: currentUserId });
  const event = notification.event && EVENT_VERB[notification.event];
  const context =
    notification.context &&
    contextToString(notification.context, { id: currentUserId });
  const date =
    notification.modifiedAt && parseNotificationDate(notification.modifiedAt);

  switch (notification.event) {
    case 'MESSAGE_CREATED': {
      const entities = notification.entities.filter(
        ({ payload }) => payload.senderId !== currentUserId
      );

      return {
        data: {
          href: `/thread/${notification.context.id}`,
        },
        title: `${actors} ${event} ${context}`,
        body: sentencify(
          entities.map(({ payload }) => `"${payload.content.body}"`)
        ),
        raw: notification,
      };
    }
    case 'REACTION_CREATED': {
      const message = notification.context.payload;

      return {
        data: {
          href: `/thread/${message.threadId}`,
        },
        title: `${actors} ${event} ${context}`,
        body: message.content.body,
        raw: notification,
      };
    }
    case 'CHANNEL_CREATED': {
      const entities = notification.entities;
      const newChannelCount =
        entities.length > 1
          ? `${entities.length} new channels were`
          : 'A new channel was';

      return {
        title: `${newChannelCount} ${event} ${context}`,
        body: sentencify(entities.map(({ payload }) => `"${payload.name}"`)),
        raw: notification,
      };
    }
    case 'USER_JOINED_COMMUNITY': {
      return {
        data: {
          href: `/${notification.context.payload.slug}`,
        },
        title: `${actors} ${event} ${context}`,
        raw: notification,
      };
    }
    case 'THREAD_CREATED': {
      // sort and order the threads
      const threads = sortThreads(notification.entities, { id: currentUserId });

      const newThreadCount =
        threads.length > 1 ? `New threads were` : 'A new thread was';

      return {
        data: {
          href: `/thread/${threads[0].id}`,
        },
        title: `${newThreadCount} published in ${context}`,
        body: sentencify(threads.map(thread => `"${thread.content.title}"`)),
        raw: notification,
      };
    }
    case 'COMMUNITY_INVITE': {
      return {
        data: {
          href: `/${notification.context.payload.slug}`,
        },
        title: `${actors} invited you to join their community, ${context}`,
        raw: notification,
      };
    }
    default: {
      return {};
    }
  }
};

export default formatNotification;
