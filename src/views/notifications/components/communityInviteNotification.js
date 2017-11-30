import * as React from 'react';
import compose from 'recompose/compose';
import { getCommunityById } from '../../../api/community';
import { displayLoadingCard } from '../../../components/loading';
import { parseNotificationDate, parseContext, parseActors } from '../utils';
import { markSingleNotificationSeenMutation } from '../../../api/notification';
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

const CommunityInvite = compose(getCommunityById, displayLoadingCard)(
  CommunityInviteComponent
);

export const CommunityInviteNotification = ({ notification, currentUser }) => {
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);
  const actors = parseActors(notification.actors, currentUser, true);

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

type Props = {
  notification: Object,
  currentUser: Object,
  history: Object,
  markSingleNotificationSeen: Function,
  markSingleNotificationAsSeenInState: Function,
};

class MiniCommunityInviteNotificationWithMutation extends React.Component<
  Props
> {
  markAsSeen = () => {
    const {
      markSingleNotificationSeen,
      notification,
      markSingleNotificationAsSeenInState,
    } = this.props;
    if (notification.isSeen) return;
    markSingleNotificationAsSeenInState(notification.id);
    markSingleNotificationSeen(notification.id);
  };

  render() {
    const { notification, currentUser, history } = this.props;

    const date = parseNotificationDate(notification.modifiedAt);
    const context = parseContext(notification.context);
    const actors = parseActors(notification.actors, currentUser, true);

    return (
      <SegmentedNotificationListRow onClick={this.markAsSeen}>
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
  }
}

export const MiniCommunityInviteNotification = compose(
  markSingleNotificationSeenMutation
)(MiniCommunityInviteNotificationWithMutation);
