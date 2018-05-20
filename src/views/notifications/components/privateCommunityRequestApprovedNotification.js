// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { parseActors, parseEvent, parseNotificationDate } from '../utils';
import { ActorsRow } from './actorsRow';
import {
  NotificationCard,
  TextContent,
  NotificationListRow,
  JoinContext,
  Content,
} from '../style';
import Icon from '../../../components/icons';
import {
  CardLink,
  CardContent,
} from '../../../components/threadFeedCard/style';
import compose from 'recompose/compose';
import markSingleNotificationSeenMutation from 'shared/graphql/mutations/notification/markSingleNotificationSeen';

type Props = {
  notification: Object,
  currentUser: Object,
  markSingleNotificationSeen?: Function,
  markSingleNotificationAsSeenInState?: Function,
};

export class PrivateCommunityRequestApproved extends React.Component<Props> {
  render() {
    const { notification, currentUser } = this.props;

    const actors = parseActors(notification.actors, currentUser, true);
    const event = parseEvent(notification.event);
    const date = parseNotificationDate(notification.modifiedAt);

    return (
      <NotificationCard>
        <CardLink to={`/${notification.context.payload.slug}/`} />
        <CardContent>
          <JoinContext>
            <Icon glyph="member-add" />
            <ActorsRow actors={actors.asObjects} />
          </JoinContext>
        </CardContent>
        <Content>
          <TextContent pointer={false}>
            {' '}
            {actors.asString} {event} the{' '}
            <Link to={`/${notification.context.payload.slug}`}>
              {notification.context.payload.name}
            </Link>{' '}
            community {date}{' '}
          </TextContent>
        </Content>
      </NotificationCard>
    );
  }
}

class MiniPrivateCommunityRequestApprovedWithMutation extends React.Component<
  Props
> {
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
    const { notification, currentUser } = this.props;

    const actors = parseActors(notification.actors, currentUser, true);
    const event = parseEvent(notification.event);
    const date = parseNotificationDate(notification.modifiedAt);

    return (
      <NotificationListRow
        isSeen={notification.isSeen}
        onClick={this.markAsSeen}
      >
        <CardLink to={`/${notification.context.payload.slug}/`} />
        <CardContent>
          <JoinContext>
            <Icon glyph="member-add" />
            <ActorsRow actors={actors.asObjects} />
          </JoinContext>
        </CardContent>
        <Content>
          <TextContent pointer={false}>
            {' '}
            {actors.asString} {event} the{' '}
            <Link to={`/${notification.context.payload.slug}`}>
              {notification.context.payload.name}
            </Link>{' '}
            community {date}{' '}
          </TextContent>
        </Content>
      </NotificationListRow>
    );
  }
}

export const MiniPrivateCommunityRequestApproved = compose(
  markSingleNotificationSeenMutation
)(MiniPrivateCommunityRequestApprovedWithMutation);
