//@flow
import React from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { convertTimestampToTime } from '../../helpers/utils';
import { Bubble } from '../../components/bubbles';
import {
  parseNotification,
  parseActors,
  parseEvent,
  parseNotificationDate,
  parseContext,
  getLastMessageCreatedByAnotherUser,
} from '../../helpers/notification';
import Icon from '../../components/icons';
import { Column } from '../../components/column';
import { FlexRow } from '../../components/globals';
import AppViewWrapper from '../../components/appViewWrapper';
import { displayLoadingNotifications } from '../../components/loading';
import {
  NotificationCard,
  Content,
  ContentHeading,
  Message,
  ActorPhotosContainer,
  ActorPhotoItem,
  ActorPhoto,
  TextContent,
  BubbleContainer,
} from './style';
import {
  constructMessage,
  constructContent,
  getIconByType,
} from '../../helpers/notifications';
import { getNotifications } from '../../api/notification';
import { UpsellSignIn } from '../../components/upsell';
import {
  BubbleGroupContainer,
  MessagesWrapper,
  MessageWrapper,
} from '../../components/chatMessages/style';
import { ReactionWrapper, Count } from '../../components/reaction/style';

const NewMessageNotification = ({ notification, currentUser }) => {
  const actors = parseActors(notification.actors, currentUser);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);
  const message = getLastMessageCreatedByAnotherUser(
    notification.entities,
    currentUser
  );

  return (
    <NotificationCard key={notification.id}>
      <ActorPhotosContainer>
        {actors.asObjects.map(actor => {
          return (
            <ActorPhotoItem key={actor.id}>
              <Link to={`/users/${actor.username}`}>
                <ActorPhoto src={actor.profilePhoto} />
              </Link>
            </ActorPhotoItem>
          );
        })}
      </ActorPhotosContainer>
      <TextContent>
        {actors.asString} {event} {date} {context.asString}
      </TextContent>
      <BubbleContainer me={false}>
        <BubbleGroupContainer me={false}>
          <MessagesWrapper>
            <MessageWrapper
              me={false}
              timestamp={convertTimestampToTime(message.timestamp)}
            >
              <Bubble
                me={false}
                pending={false}
                type={'thread'}
                message={message.content}
              />
            </MessageWrapper>
          </MessagesWrapper>
        </BubbleGroupContainer>
      </BubbleContainer>
    </NotificationCard>
  );
};

const NewReactionNotification = ({ notification, currentUser }) => {
  const actors = parseActors(notification.actors, currentUser);
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);

  return (
    <NotificationCard key={notification.id}>
      <ActorPhotosContainer>
        {actors.asObjects.map(actor => {
          return (
            <ActorPhotoItem key={actor.id}>
              <Link to={`/users/${actor.username}`}>
                <ActorPhoto src={actor.profilePhoto} />
              </Link>
            </ActorPhotoItem>
          );
        })}
      </ActorPhotosContainer>
      <TextContent>{actors.asString} {event} {date}</TextContent>
      <BubbleContainer me={true}>
        <BubbleGroupContainer me={true}>
          <MessagesWrapper>
            <MessageWrapper
              me={true}
              timestamp={convertTimestampToTime(
                notification.context.payload.timestamp
              )}
            >
              <Bubble
                me={true}
                pending={false}
                type={'thread'}
                message={notification.context.payload.content}
              />
              <ReactionWrapper
                hasCount={true}
                active={true}
                me={true}
                hide={false}
                dummy={true}
              >
                <Icon glyph="like-fill" size={16} color={'text.reverse'} />
              </ReactionWrapper>
            </MessageWrapper>
          </MessagesWrapper>
        </BubbleGroupContainer>
      </BubbleContainer>
    </NotificationCard>
  );
};

const NotificationsPure = ({ notificationsQuery, currentUser }) => {
  // our router should prevent this from happening, but just in case
  if (!currentUser) {
    return <UpsellSignIn />;
  }

  const notifications =
    currentUser &&
    notificationsQuery.notifications.edges.map(notification =>
      parseNotification(notification.node)
    );

  console.log(notifications);

  // const { notifications: { edges } } = data;
  return (
    <AppViewWrapper>
      <Column type={'primary'}>
        {notifications.map(notification => {
          switch (notification.event) {
            case 'MESSAGE_CREATED': {
              return (
                <NewMessageNotification
                  key={notification.id}
                  notification={notification}
                  currentUser={currentUser}
                />
              );
            }
            case 'REACTION_CREATED': {
              return (
                <NewReactionNotification
                  key={notification.id}
                  notification={notification}
                  currentUser={currentUser}
                />
              );
            }
          }
        })}
      </Column>
    </AppViewWrapper>
  );
};

const Notifications = compose(
  getNotifications,
  displayLoadingNotifications,
  pure
)(NotificationsPure);

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(Notifications);
