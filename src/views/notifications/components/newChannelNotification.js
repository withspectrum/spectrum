import * as React from 'react';
import compose from 'recompose/compose';
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
import { markSingleNotificationSeenMutation } from '../../../api/notification';

const NewChannelComponent = ({ data }) => {
  return <ChannelProfile profileSize="miniWithAction" data={data} />;
};

const NewChannel = compose(getChannelById, displayLoadingCard)(
  NewChannelComponent
);

export const NewChannelNotification = ({ notification, currentUser }) => {
  const date = parseNotificationDate(notification.modifiedAt);
  const context = parseContext(notification.context);
  const newChannelCount =
    notification.entities.length > 1
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

type Props = {
  notification: Object,
  currentUsre: Object,
  history: Object,
  markSingleNotificationSeen: Function,
  markSingleNotificationAsSeenInState: Function,
};

class MiniNewChannelNotificationWithMutation extends React.Component<Props> {
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
    const newChannelCount =
      notification.entities.length > 1
        ? `${notification.entities.length} new channels were`
        : 'A new channel was';

    return (
      <SegmentedNotificationListRow onClick={this.markAsSeen}>
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
  }
}

export const MiniNewChannelNotification = compose(
  markSingleNotificationSeenMutation
)(MiniNewChannelNotificationWithMutation);
