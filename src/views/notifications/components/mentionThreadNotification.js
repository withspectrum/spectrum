// @flow
import * as React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
import { ActorsRow } from './actorsRow';
import { getThreadById } from '../../../api/thread';
import { displayLoadingCard } from '../../../components/loading';
import { parseNotificationDate, parseContext, parseActors } from '../utils';
import Icon from '../../../components/icons';
import { ThreadProfile } from '../../../components/profile';
import {
  SegmentedNotificationCard,
  TextContent,
  AttachmentsWash,
  ContentWash,
  NotificationListRow,
  SpecialContext,
  ThreadContext,
  Content,
} from '../style';
import {
  CardLink,
  CardContent,
} from '../../../components/threadFeedCard/style';

type Props = {
  notification: Object,
  currentUser: Object,
  history: Object,
};
type State = {
  communityName: string,
};

const ThreadComponent = ({ data, ...rest }) => {
  return <ThreadProfile profileSize="mini" data={data} {...rest} />;
};

const ThreadCreated = compose(getThreadById, displayLoadingCard)(
  ThreadComponent
);

/*
  NOTE: @brianlovin
  These new thread notifications are handled with a contextId that matches a *thread*. This means that we can't easily access community information within the notification.

  However, because this notification fetches thread data, we will get community info back from the response! I use a slightly hacky component state + props to bubble the community name up from the ThreadCreated component whenever the data fetches, then use that to set local component state to show the community name in the notification.
*/

export class MentionThreadNotification extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      communityName: '',
    };
  }

  render() {
    const { notification, currentUser } = this.props;

    const actors = parseActors(notification.actors, currentUser, false);
    const date = parseNotificationDate(notification.modifiedAt);
    const context = parseContext(notification.context, currentUser);

    return (
      <SegmentedNotificationCard>
        <ThreadContext>
          <SpecialContext>
            <Icon glyph="mention" />
            <TextContent pointer={true}>
              {actors.asObjects[0].name} mentioned you in {context.asString}{' '}
              {date}
            </TextContent>
          </SpecialContext>
        </ThreadContext>
        <ContentWash>
          <AttachmentsWash>
            <ThreadCreated id={notification.context.id} />
          </AttachmentsWash>
        </ContentWash>
      </SegmentedNotificationCard>
    );
  }
}

export class MiniMentionThreadNotification extends React.Component<
  Props,
  State
> {
  constructor() {
    super();

    this.state = {
      communityName: '',
    };
  }

  render() {
    const { notification, currentUser } = this.props;

    const actors = parseActors(notification.actors, currentUser, false);
    const date = parseNotificationDate(notification.modifiedAt);
    const context = parseContext(notification.context, currentUser);

    return (
      <NotificationListRow>
        <CardLink
          to={{
            pathname: window.location.pathname,
            search: `?thread=${notification.context.id}`,
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
