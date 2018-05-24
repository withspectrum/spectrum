import onlyContainsEmoji from 'shared/only-contains-emoji';
import sentencify from 'shared/sentencify';
import { timeDifferenceShort } from 'shared/time-difference';
import sortByDate from 'shared/sort-by-date';
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
  MENTION_MESSAGE: 'mentioned you in',
  MENTION_THREAD: 'mentioned you in',
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
    case 'MENTION_MESSAGE': {
      const entities = notification.entities.filter(
        ({ payload }) => payload.senderId !== currentUserId
      );

      if (notification.context.type === 'DIRECT_MESSAGE_THREAD') {
        href = `/messages/${notification.context.id}`;
      } else {
        href = `/thread/${notification.context.id}`;
      }
      body = sentencify(
        entities.map(({ payload }) => {
          if (payload.messageType === 'draftjs') {
            let body = payload.content.body;
            if (typeof body === 'string')
              body = JSON.parse(payload.content.body);
            return `"${toPlainText(toState(body)).replace(
              /[ \n\r\v]+/g,
              ' '
            )}"`;
          }

          return `"${payload.content.body.replace(/[ \n\r\v]+/g, ' ')}"`;
        })
      );
      break;
    }
    case 'MESSAGE_CREATED': {
      const entities = notification.entities.filter(
        ({ payload }) => payload.senderId !== currentUserId
      );

      if (notification.context.type === 'DIRECT_MESSAGE_THREAD') {
        title = `New ${
          entities.length > 1 ? 'replies' : 'reply'
        } in a direct message thread`;
        href = `/messages/${notification.context.id}`;
      } else {
        title = `${notification.context.payload.content.title} (${
          entities.length
        } new ${entities.length > 1 ? 'replies' : 'reply'})`;
        href = `/thread/${notification.context.id}`;
      }
      body = entities
        .map(({ payload }) => {
          const sender = notification.actors.find(
            actor => payload.senderId === actor.id
          );
          if (payload.messageType === 'draftjs') {
            let body = payload.content.body;
            if (typeof body === 'string')
              body = JSON.parse(payload.content.body);
            return `${sender.payload.name} (@${
              sender.payload.username
            }): ${toPlainText(toState(body))}`;
          }

          return `${sender.payload.name}: ${payload.content.body}`;
        })
        .join('\n');
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
    case 'MENTION_THREAD': {
      // sort and order the threads
      const threads = sortThreads(notification.entities, { id: currentUserId });
      const urlBase =
        notification.context.type === 'DIRECT_MESSAGE_THREAD'
          ? 'messages'
          : 'thread';

      href = `/${urlBase}/${threads[0].id}`;
      body = sentencify(threads.map(thread => `"${thread.content.title}"`));
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
