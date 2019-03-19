// @flow
import * as React from 'react';
import { ActorsRow } from './actorsRow';
import { parseNotificationDate, parseContext, parseActors } from '../utils';
import Icon from 'src/components/icon';
import {
  TextContent,
  Content,
  NotificationCard,
  NotificationListRow,
  SpecialContext,
} from '../style';
import { CardLink, CardContent } from 'src/components/threadFeedCard/style';
import getThreadLink from 'src/helpers/get-thread-link';

type Props = {
  notification: Object,
  currentUser: Object,
  history?: Object,
};
type State = {
  communityName: string,
};
/*
  NOTE: @brianlovin
  These new thread notifications are handled with a contextId that matches a *thread*. This means that we can't easily access community information within the notification.

  However, because this notification fetches thread data, we will get community info back from the response! I use a slightly hacky component state + props to bubble the community name up from the ThreadCreated component whenever the data fetches, then use that to set local component state to show the community name in the notification.
*/

export class MentionMessageNotification extends React.Component<Props, State> {
  render() {
    const { notification, currentUser } = this.props;

    const actors = parseActors(notification.actors, currentUser, false);
    const date = parseNotificationDate(notification.modifiedAt);
    const context = parseContext(notification.context, currentUser);

    return (
      <NotificationCard>
        <CardLink
          to={{
            pathname: getThreadLink(notification.context.payload),
          }}
        />
        <SpecialContext>
          <Icon glyph="mention" />
          <ActorsRow actors={actors.asObjects} />
        </SpecialContext>
        <Content>
          <TextContent pointer={true}>
            {actors.asObjects[0].name} mentioned you in {context.asString}{' '}
            {date}
          </TextContent>
        </Content>
      </NotificationCard>
    );
  }
}

export class MiniMentionMessageNotification extends React.Component<
  Props,
  State
> {
  render() {
    const { notification, currentUser } = this.props;

    const actors = parseActors(notification.actors, currentUser, false);
    const date = parseNotificationDate(notification.modifiedAt);
    const context = parseContext(notification.context, currentUser);

    return (
      <NotificationListRow isSeen={notification.isSeen}>
        <CardLink
          to={{
            pathname: getThreadLink(notification.context.payload),
          }}
        />
        <CardContent>
          <SpecialContext>
            <Icon glyph="mention" />
            <ActorsRow actors={actors.asObjects} />
          </SpecialContext>
          <Content>
            <TextContent pointer={false}>
              {actors.asString} mentioned you in {context.asString} {date}
            </TextContent>
          </Content>
        </CardContent>
      </NotificationListRow>
    );
  }
}
