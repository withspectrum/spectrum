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

export class PrivateChannelRequestApproved extends React.Component<Props> {
  render() {
    const { notification, currentUser } = this.props;

    const actors = parseActors(notification.actors, currentUser, true);
    const event = parseEvent(notification.event);
    const date = parseNotificationDate(notification.modifiedAt);
    const context = parseContext(notification.context);
    const channel = notification.entities[0].payload;

    return (
      <NotificationCard>
        <CardLink
          to={`/${notification.context.payload.slug}/${
            notification.entities[0].payload.slug
          }`}
        />
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
            <Link to={`/${context.slug}/${channel.slug}`}>{channel.name}</Link>{' '}
            channel in {context.asString} {date}{' '}
          </TextContent>
        </Content>
      </NotificationCard>
    );
  }
}

class MiniPrivateChannelRequestApprovedWithMutation extends React.Component<
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
    const context = parseContext(notification.context);
    const channel = notification.entities[0].payload;

    return (
      <NotificationListRow
        isSeen={notification.isSeen}
        onClick={this.markAsSeen}
      >
        <CardLink
          to={`/${notification.context.payload.slug}/${
            notification.entities[0].payload.slug
          }`}
        />
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
            <Link to={`/${context.slug}/${channel.slug}`}>{channel.name}</Link>{' '}
            channel in {context.asString} {date}{' '}
          </TextContent>
        </Content>
      </NotificationListRow>
    );
  }
}

export const MiniPrivateChannelRequestApproved = compose(
  markSingleNotificationSeenMutation
)(MiniPrivateChannelRequestApprovedWithMutation);
