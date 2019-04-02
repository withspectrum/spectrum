// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import { parseActors, parseEvent, parseNotificationDate } from '../utils';
import { ActorsRow } from './actorsRow';
import {
  NotificationCard,
  TextContent,
  ApprovedContext,
  Content,
} from '../style';
import Icon from 'src/components/icon';
import { CardLink, CardContent } from 'src/components/threadFeedCard/style';

type Props = {
  notification: Object,
  currentUser: Object,
  markSingleNotificationSeen: Function,
};

export class PrivateCommunityRequestApproved extends React.Component<Props> {
  render() {
    const {
      notification,
      currentUser,
      markSingleNotificationSeen,
    } = this.props;

    const actors = parseActors(notification.actors, currentUser, true);
    const event = parseEvent(notification.event);
    const date = parseNotificationDate(notification.modifiedAt);

    return (
      <NotificationCard
        onClick={() => markSingleNotificationSeen(notification.id)}
        isSeen={notification.isSeen}
      >
        <CardLink to={`/${notification.context.payload.slug}/`} />
        <CardContent>
          <ApprovedContext>
            <Icon glyph="member-add" />
            <ActorsRow actors={actors.asObjects} />
          </ApprovedContext>
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
