// @flow
import React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
import { getCommunityById } from '../../../api/community';
import { displayLoadingCard } from '../../../components/loading';
import { parseNotificationDate, parseContext, parseActors } from '../utils';
import Icon from '../../../components/icons';
import {
  SegmentedNotificationCard,
  TextContent,
  SegmentedNotificationListRow,
  AttachmentsWash,
  CreatedContext,
  ContentWash,
} from '../style';
import { CommunityProfile } from '../../../components/profile';

const CommunityInviteComponent = ({ data }) => {
  return <CommunityProfile profileSize={'miniWithAction'} data={data} />;
};

const CommunityInvite = compose(getCommunityById, displayLoadingCard, pure)(
  CommunityInviteComponent
);

export const CommunityInviteNotification = ({ notification, currentUser }) => {
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);
  const actors = parseActors(notification.actors, currentUser);

  return (
    <SegmentedNotificationCard>
      <CreatedContext>
        <Icon glyph="community" />
        <TextContent pointer={true}>
          {actors.asObjects[0].name} invited you to join their community,{' '}
          {context.asString} {date}
        </TextContent>
      </CreatedContext>
      <ContentWash>
        <AttachmentsWash>
          <CommunityInvite id={notification.context.payload.id} />
        </AttachmentsWash>
      </ContentWash>
    </SegmentedNotificationCard>
  );
};

export const MiniCommunityInviteNotification = ({
  notification,
  currentUser,
  history,
}) => {
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);
  const actors = parseActors(notification.actors, currentUser);

  return (
    <SegmentedNotificationListRow>
      <CreatedContext>
        <Icon glyph="community" />
        <TextContent pointer={false}>
          {actors.asObjects[0].name} invited you to join their community,{' '}
          {context.asString} {date}
        </TextContent>
      </CreatedContext>
      <ContentWash mini>
        <AttachmentsWash>
          <CommunityInvite id={notification.context.payload.id} />
        </AttachmentsWash>
      </ContentWash>
    </SegmentedNotificationListRow>
  );
};
