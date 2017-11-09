// @flow
import * as React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
import { ActorsRow } from './actorsRow';
import { getThreadById } from '../../../api/thread';
import { sortByDate } from '../../../helpers/utils';
import { displayLoadingCard } from '../../../components/loading';
import { parseNotificationDate, parseContext, parseActors } from '../utils';
import Icon from '../../../components/icons';
import { ThreadProfile } from '../../../components/profile';
import {
  SegmentedNotificationCard,
  TextContent,
  SegmentedNotificationListRow,
  AttachmentsWash,
  ContentWash,
  NotificationCard,
  NotificationListRow,
  SpecialContext,
  HzRule,
  Content,
} from '../style';
import { Sender, MessageGroup } from '../../../components/messageGroup/style';
import { AuthorAvatar, AuthorByline } from '../../../components/messageGroup';
import Message from '../../../components/message';
import { sortAndGroupNotificationMessages } from './sortAndGroupNotificationMessages';
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

  setCommunityName = (name: string) => this.setState({ communityName: name });

  render() {
    const { notification, currentUser } = this.props;
    const { communityName } = this.state;

    const actors = parseActors(notification.actors, currentUser, false);
    const sender = actors.asObjects[0];
    const date = parseNotificationDate(notification.modifiedAt);
    const context = parseContext(notification.context, currentUser);
    const message =
      notification.entities.length > 0
        ? notification.entities[0].payload
        : null;
    const thread = context;

    return (
      <SegmentedNotificationCard>
        <SpecialContext>
          <Icon glyph="mention" />
          <TextContent pointer={true}>
            {actors.asObjects[0].name} mentioned you in {context.asString}{' '}
            {date}
          </TextContent>
        </SpecialContext>
        <ContentWash>
          <AttachmentsWash>
            <ThreadCreated
              setName={this.setCommunityName}
              id={notification.context.id}
            />
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

  setCommunityName = (name: string) => this.setState({ communityName: name });

  render() {
    const { notification, currentUser } = this.props;
    const { communityName } = this.state;

    const actors = parseActors(notification.actors, currentUser, false);
    const sender = actors.asObjects[0];
    const date = parseNotificationDate(notification.modifiedAt);
    const context = parseContext(notification.context, currentUser);
    const message =
      notification.entities.length > 0 ? notification.entities[0] : null;
    const thread = context;

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
