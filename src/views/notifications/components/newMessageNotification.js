import React from 'react';
// $FlowFixMe
import { Link } from 'react-router-dom';
import {
  parseActors,
  parseEvent,
  parseNotificationDate,
  parseContext,
} from '../utils';
import {
  convertTimestampToTime,
  onlyContainsEmoji,
} from '../../../helpers/utils';

import { ActorsRow } from './actorsRow';
import {
  CardLink,
  CardContent,
} from '../../../components/threadFeedCard/style';
import { Bubble, EmojiBubble, ImgBubble } from '../../../components/bubbles';
import Icon from '../../../components/icons';
import {
  Wrapper,
  Sender,
  MessageGroup,
} from '../../../components/messageGroup/style';
import { AuthorAvatar, AuthorByline } from '../../../components/messageGroup';
import Message from '../../../components/message';
import { sortAndGroupNotificationMessages } from './sortAndGroupNotificationMessages';
import {
  BubbleGroupContainer,
  NotificationCard,
  TextContent,
  BubbleContainer,
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
    <NotificationCard>
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
              let sender = actors.asObjects.filter(
                user => user.id === initialMessage.senderId
              )[0];
              const me = currentUser ? sender.id === currentUser.id : false;

              return (
                <Sender>
                  {!me && <AuthorAvatar sender={sender} />}

                  <MessageGroup me={me}>
                    <AuthorByline sender={sender} me={me} />
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
                          // threadId={threadId}
                          context={'notification'}
                        />
                      );
                    })}
                  </MessageGroup>
                </Sender>
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
    <NotificationListRow>
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
