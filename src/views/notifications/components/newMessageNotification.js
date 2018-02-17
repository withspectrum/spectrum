import React from 'react';
import {
  parseActors,
  parseEvent,
  parseNotificationDate,
  parseContext,
} from '../utils';
import { ActorsRow } from './actorsRow';
import {
  CardLink,
  CardContent,
} from '../../../components/threadFeedCard/style';
import Icon from '../../../components/icons';
import { Author, MessageGroup } from '../../../components/messageGroup/style';
import { AuthorAvatar, AuthorByline } from '../../../components/messageGroup';
import Message from '../../../components/message';
import { sortAndGroupNotificationMessages } from './sortAndGroupNotificationMessages';
import {
  NotificationCard,
  TextContent,
  NotificationListRow,
  AttachmentsWash,
  SuccessContext,
  HzRule,
  Content,
} from '../style';

export const NewMessageNotification = ({ notification, currentUser }) => {
  const actors = parseActors(notification.actors, currentUser, false);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context, currentUser);
  const unsortedMessages = notification.entities.map(notif => notif.payload);
  const messages = sortAndGroupNotificationMessages(unsortedMessages);

  return (
    <NotificationCard isSeen={notification.isSeen}>
      <CardLink
        to={{
          pathname: window.location.pathname,
          search: `?thread=${notification.context.id}`,
        }}
      />
      <CardContent>
        <SuccessContext>
          <Icon glyph="message-fill" />
          <ActorsRow actors={actors.asObjects} />
        </SuccessContext>
        <Content>
          <TextContent pointer={true}>
            {' '}
            {actors.asString} {event} {context.asString} {date}{' '}
          </TextContent>
          <AttachmentsWash>
            <HzRule>
              <hr />
              <Icon glyph="message" />
              <hr />
            </HzRule>
            {messages.map((group, i) => {
              const initialMessage = group[0];
              let author = actors.asObjects.filter(
                user => user.id === initialMessage.senderId
              )[0];
              const me = currentUser ? author.id === currentUser.id : false;

              return (
                <Author key={i}>
                  {!me && <AuthorAvatar user={author} />}

                  <MessageGroup me={me}>
                    <AuthorByline user={author} me={me} />
                    {group.map((message, i) => {
                      return (
                        <Message
                          key={i}
                          message={message}
                          link={`#${message.id}`}
                          me={me}
                          canModerate={me}
                          pending={message.id < 0}
                          currentUser={currentUser}
                          context={'notification'}
                        />
                      );
                    })}
                  </MessageGroup>
                </Author>
              );
            })}
          </AttachmentsWash>
        </Content>
      </CardContent>
    </NotificationCard>
  );
};

export const MiniNewMessageNotification = ({
  notification,
  currentUser,
  history,
}) => {
  const actors = parseActors(notification.actors, currentUser, true);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context, currentUser);

  return (
    <NotificationListRow isSeen={notification.isSeen}>
      <CardLink
        to={{
          pathname: window.location.pathname,
          search: `?thread=${notification.context.id}`,
        }}
      />
      <CardContent>
        <SuccessContext>
          <Icon glyph="message-fill" />
          <ActorsRow actors={actors.asObjects} />
        </SuccessContext>
        <Content>
          <TextContent pointer={false}>
            {actors.asString} {event} {context.asString} {date}
          </TextContent>
        </Content>
      </CardContent>
    </NotificationListRow>
  );
};
