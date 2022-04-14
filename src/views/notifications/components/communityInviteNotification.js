// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { getCommunityById } from 'shared/graphql/queries/community/getCommunity';
import { displayLoadingCard } from 'src/components/loading';
import { parseNotificationDate, parseContext, parseActors } from '../utils';
import Icon from 'src/components/icon';
import {
  SegmentedNotificationCard,
  TextContent,
  AttachmentsWash,
  CreatedContext,
  ContentWash,
} from '../style';

const CommunityInviteComponent = () => {
  // TODO @brian
  return null;
};

const CommunityInvite = compose(
  getCommunityById,
  displayLoadingCard
)(CommunityInviteComponent);

export const CommunityInviteNotification = ({
  notification,
  currentUser,
  markSingleNotificationSeen,
}: {
  notification: Object,
  currentUser: Object,
  markSingleNotificationSeen: Function,
}) => {
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);
  const actors = parseActors(notification.actors, currentUser, true);

  return (
    <SegmentedNotificationCard
      onClick={() => markSingleNotificationSeen(notification.id)}
      isSeen={notification.isSeen}
    >
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
