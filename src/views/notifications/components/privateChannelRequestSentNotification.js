// @flow
import * as React from 'react';
import { Link } from 'react-router-dom';
import {
  parseActors,
  parseEvent,
  parseNotificationDate,
  parseContext,
} from '../utils';
import { ActorsRow } from './actorsRow';
import {
  NotificationCard,
  TextContent,
  RequestContext,
  Content,
} from '../style';
import Icon from 'src/components/icon';
import { CardLink, CardContent } from 'src/components/threadFeedCard/style';

type Props = {
  notification: Object,
  currentUser: Object,
  markSingleNotificationSeen: Function,
};

export class PrivateChannelRequestSent extends React.Component<Props> {
  render() {
    const {
      notification,
      currentUser,
      markSingleNotificationSeen,
    } = this.props;

    const actors = parseActors(notification.actors, currentUser, true);
    const event = parseEvent(notification.event);
    const date = parseNotificationDate(notification.modifiedAt);
    const context = parseContext(notification.context);
    const channel = notification.entities[0].payload;

    return (
      <NotificationCard
        onClick={() => markSingleNotificationSeen(notification.id)}
        isSeen={notification.isSeen}
      >
        <CardLink
          to={`/${notification.context.payload.slug}/${
            notification.entities[0].payload.slug
          }/settings`}
        />
        <CardContent>
          <RequestContext>
            <Icon glyph="person" />
            <ActorsRow actors={actors.asObjects} />
          </RequestContext>
        </CardContent>
        <Content>
          <TextContent pointer={false}>
            {' '}
            {actors.asString} {event} the{' '}
            <Link to={`/${context.slug}/${channel.slug}`}>{channel.name}</Link>{' '}
            channel in {context.asString} {date}{' '}
          </TextContent>
        </Content>
      </NotificationCard>
    );
  }
}
