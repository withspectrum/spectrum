// @flow
import * as React from 'react';
import {
  parseActors,
  parseEvent,
  parseNotificationDate,
  parseContext,
} from '../utils';
import { ActorsRow } from './actorsRow';
import { NotificationCard, TextContent, JoinContext, Content } from '../style';
import Icon from 'src/components/icon';
import { CardLink, CardContent } from 'src/components/threadFeedCard/style';

type Props = {
  notification: Object,
  currentUser: Object,
  markSingleNotificationSeen: Function,
};
export class NewUserInCommunityNotification extends React.Component<Props> {
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

    if (!actors.asString || !actors.asObjects || actors.asObjects.length === 0)
      return null;

    return (
      <NotificationCard
        onClick={() => markSingleNotificationSeen(notification.id)}
        isSeen={notification.isSeen}
      >
        <CardLink to={`/${notification.context.payload.slug}`} />
        <CardContent>
          <JoinContext>
            <Icon glyph="member-add" />
            <ActorsRow actors={actors.asObjects} />
          </JoinContext>
        </CardContent>
        <Content>
          <TextContent pointer={true}>
            {' '}
            {actors.asString} {event} {context.asString} {date}{' '}
          </TextContent>
        </Content>
      </NotificationCard>
    );
  }
}
