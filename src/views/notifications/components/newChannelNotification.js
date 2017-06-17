// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
import { getChannelById } from '../../../api/channel';
import { displayLoadingCard } from '../../../components/loading';
import { parseNotificationDate, parseContext } from '../utils';
import Icon from '../../../components/icons';
import {
  SegmentedNotificationCard,
  TextContent,
  SegmentedNotificationListRow,
  AttachmentsWash,
  CreatedContext,
  ContentWash,
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
    <SegmentedNotificationCard>
      <CreatedContext>
        <Icon glyph="community" />
        <TextContent pointer={true}>
          {newChannelCount} created in {context.asString} {date}
        </TextContent>
      </CreatedContext>
      <ContentWash>
        <AttachmentsWash>
          {notification.entities.map(channel => {
            return (
              <NewChannel key={channel.payload.id} id={channel.payload.id} />
            );
          })}
        </AttachmentsWash>
      </ContentWash>
    </SegmentedNotificationCard>
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
    <SegmentedNotificationListRow>
      <CreatedContext>
        <Icon glyph="community" />
        <TextContent pointer={false}>
          {newChannelCount} created in {context.asString} {date}
        </TextContent>
      </CreatedContext>
      <ContentWash mini>
        <AttachmentsWash>
          {notification.entities.map(channel => {
            return (
              <NewChannel key={channel.payload.id} id={channel.payload.id} />
            );
          })}
        </AttachmentsWash>
      </ContentWash>
    </SegmentedNotificationListRow>
  );
};
