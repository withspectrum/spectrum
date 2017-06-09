// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
import { getChannelById } from '../../../api/channel';
import { displayLoadingCard } from '../../../components/loading';
import {
  parseActors,
  parseEvent,
  parseNotificationDate,
  parseContext,
  getLastMessageCreatedByAnotherUser,
} from '../utils';
import { ActorsRow } from './actorsRow';
import { convertTimestampToTime } from '../../../helpers/utils';
import {
  NotificationCard,
  TextContent,
  NotificationListRow,
  Timestamp,
  AttachmentsWash,
} from '../style';
import {
  CardLink,
  CardContent,
} from '../../../components/threadFeedCard/style';
import { Button } from '../../../components/buttons';
import { ChannelProfile } from '../../../components/profile';

const NewChannelComponent = ({ data }) => {
  return <ChannelProfile profileSize="miniWithAction" data={data} />;
};

const NewChannel = compose(getChannelById, displayLoadingCard, pure)(
  NewChannelComponent
);

export const NewChannelNotification = ({ notification, currentUser }) => {
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);
  const newChannelCount = notification.entities.length > 1
    ? `${notification.entities.length} new channels were`
    : 'A new channel was';

  return (
    <NotificationCard>
      <TextContent pointer={true}>
        {newChannelCount} created {context.asString}
      </TextContent>
      <AttachmentsWash>
        {notification.entities.map(channel => {
          return (
            <NewChannel key={channel.payload.id} id={channel.payload.id}>
              Join
            </NewChannel>
          );
        })}
      </AttachmentsWash>
    </NotificationCard>
  );
};

export const MiniNewChannelNotification = ({
  notification,
  currentUser,
  history,
}) => {
  const event = parseEvent(notification.event);
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);
  const newChannelCount = notification.entities.length > 1
    ? `${notification.entities.length} new channels were`
    : 'A new channel was';

  return (
    <NotificationListRow>
      <TextContent pointer={false}>
        {newChannelCount} created {context.asString}
      </TextContent>
      <AttachmentsWash mini>
        {notification.entities.map(channel => {
          return (
            <NewChannel key={channel.payload.id} id={channel.payload.id}>
              Join
            </NewChannel>
          );
        })}
      </AttachmentsWash>
    </NotificationListRow>
  );
};
