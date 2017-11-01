import onlyContainsEmoji from '../../shared/only-contains-emoji';
import sentencify from '../../shared/sentencify';
import { short as timeDifferenceShort } from '../../shared/time-difference';
import sortByDate from '../../shared/sort-by-date';
import { toState, toPlainText } from 'shared/draft-utils';

const sortThreads = (entities, currentUser) => {
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
const parseNotificationDate = date => {
  const now = new Date().getTime();
  const timestamp = new Date(date).getTime();
  return timeDifferenceShort(now, timestamp);
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

const contextToString = (context, currentUser) => {
  switch (context.type) {
    case 'SLATE':
    case 'THREAD': {
      const payload = context.payload;
      const isCreator = payload.creatorId === currentUser.id;
      const str = isCreator ? 'in your thread' : 'in';
      return `${str} ${payload.content.title}`;
    }
    case 'DIRECT_MESSAGE_THREAD': {
      return 'in a direct message thread';
    }
    case 'MESSAGE':
      return 'your reply';
    case 'COMMUNITY':
      return context.payload.name;
    case 'CHANNEL':
      return context.payload.name;
  }
};

const parsePayload = input => ({
  ...input,
  payload: JSON.parse(input.payload),
});

const parseEntityPayload = entities => entities.map(parsePayload);

// Turns out this isn't super slow! 😱 https://esbench.com/bench/5966ab9999634800a03489f6
// Runs ~600k ops/s, which is way fast enough
const removeUndefinedProperties = obj => JSON.parse(JSON.stringify(obj));

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

  let title = `${actors} ${event} ${context}`;
  let href, body;

  switch (notification.event) {
    case 'MESSAGE_CREATED': {
      const entities = notification.entities.filter(
        ({ payload }) => payload.senderId !== currentUserId
      );

      href = `/thread/${notification.context.id}`;
      body = sentencify(
        entities.map(
          ({ payload }) =>
            `"${payload.messageType === 'draftjs'
              ? toPlainText(toState(payload.content.body))
              : payload.content.body}"`
        )
      );
      break;
    }
    case 'REACTION_CREATED': {
      const message = notification.context.payload;

      href = `/thread/${message.threadId}`;
      body =
        message.messageType === 'draftjs'
          ? toPlainText(toState(message.content.body))
          : message.content.body;
      break;
    }
    case 'CHANNEL_CREATED': {
      const entities = notification.entities;
      const newChannelCount =
        entities.length > 1
          ? `${entities.length} new channels were`
          : 'A new channel was';

      title = `${newChannelCount} ${event} ${context}`;
      body = sentencify(entities.map(({ payload }) => `"${payload.name}"`));
      break;
    }
    case 'USER_JOINED_COMMUNITY': {
      href = `/${notification.context.payload.slug}`;
      title = `${actors} ${event} ${context}`;
      break;
    }
    case 'THREAD_CREATED': {
      // sort and order the threads
      const threads = sortThreads(notification.entities, { id: currentUserId });

      const newThreadCount =
        threads.length > 1 ? `New threads were` : 'A new thread was';

      const urlBase =
        notification.context.type === 'DIRECT_MESSAGE_THREAD'
          ? 'messages'
          : 'thread';

      href = `/${urlBase}/${threads[0].id}`;
      title = `${newThreadCount} published in ${context}`;
      body = sentencify(threads.map(thread => `"${thread.content.title}"`));
      break;
    }
    case 'COMMUNITY_INVITE': {
      href = `/${notification.context.payload.slug}`;
      title = `${actors} invited you to join their community, ${context}`;
      break;
    }
  }

  const data = href && {
    href,
  };

  return removeUndefinedProperties({
    raw: notification,
    data,
    title,
    body,
  });
};

export default formatNotification;
