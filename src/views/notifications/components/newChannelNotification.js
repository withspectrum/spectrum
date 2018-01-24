// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { getChannelById } from 'shared/graphql/queries/channel/getChannel';
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
import markSingleNotificationSeenMutation from 'shared/graphql/mutations/notification/markSingleNotificationSeen';

const NewChannelComponent = ({ data }) => {
  return <ChannelProfile profileSize="miniWithAction" data={data} />;
};

const NewChannel = compose(getChannelById, displayLoadingCard)(
  NewChannelComponent
);

type Props = {
  notification: Object,
  currentUser: Object,
  markSingleNotificationSeen?: Function,
  markSingleNotificationAsSeenInState?: Function,
};

export class NewChannelNotification extends React.Component<Props> {
  render() {
    const { notification, currentUser } = this.props;

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
  }
}

class MiniNewChannelNotificationWithMutation extends React.Component<Props> {
  markAsSeen = () => {
    const {
      markSingleNotificationSeen,
      notification,
      markSingleNotificationAsSeenInState,
    } = this.props;
    if (notification.isSeen) return;
    markSingleNotificationAsSeenInState &&
      markSingleNotificationAsSeenInState(notification.id);
    markSingleNotificationSeen && markSingleNotificationSeen(notification.id);
  };

  render() {
    const { notification } = this.props;

    const date = parseNotificationDate(notification.modifiedAt);
    const context = parseContext(notification.context);
    const newChannelCount =
      notification.entities.length > 1
        ? `${notification.entities.length} new channels were`
        : 'A new channel was';

    return (
      <SegmentedNotificationListRow
        isSeen={notification.isSeen}
        onClick={this.markAsSeen}
      >
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
