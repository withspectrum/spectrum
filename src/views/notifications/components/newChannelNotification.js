// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
import { getChannelById } from '../../../api/channel';
import { displayLoadingCard } from '../../../components/loading';
import { parseNotificationDate, parseContext } from '../utils';
import {
  NotificationCard,
  TextContent,
  NotificationListRow,
  Timestamp,
  AttachmentsWash,
} from '../style';
import { ChannelProfile } from '../../../components/profile';

const NewChannelComponent = ({ data }) => {
  return <ChannelProfile profileSize="miniWithAction" data={data} />;
};

const NewChannel = compose(getChannelById, displayLoadingCard, pure)(
  NewChannelComponent
);

export const NewChannelNotification = ({ notification, currentUser }) => {
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);
  const newChannelCount = notification.entities.length > 1
    ? `${notification.entities.length} new channels were`
    : 'A new channel was';

  return (
    <NotificationCard>
      <TextContent pointer={true}>
        {newChannelCount} created in the {context.asString}.
      </TextContent>
      <Timestamp>{date}</Timestamp>
      <AttachmentsWash>
        {notification.entities.map(channel => {
          return (
            <NewChannel key={channel.payload.id} id={channel.payload.id} />
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
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);
  const newChannelCount = notification.entities.length > 1
    ? `${notification.entities.length} new channels were`
    : 'A new channel was';

  return (
    <NotificationListRow>
      <TextContent pointer={false}>
        {newChannelCount} created in the {context.asString}
      </TextContent>
      <Timestamp>{date}</Timestamp>
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
