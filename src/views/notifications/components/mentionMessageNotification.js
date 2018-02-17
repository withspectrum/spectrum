// @flow
import * as React from 'react';
import { ActorsRow } from './actorsRow';
import { parseNotificationDate, parseContext, parseActors } from '../utils';
import Icon from '../../../components/icons';
import {
  TextContent,
  AttachmentsWash,
  Content,
  NotificationCard,
  NotificationListRow,
  SpecialContext,
} from '../style';
import { Author, MessageGroup } from '../../../components/messageGroup/style';
import { AuthorAvatar, AuthorByline } from '../../../components/messageGroup';
import Message from '../../../components/message';
import {
  CardLink,
  CardContent,
} from '../../../components/threadFeedCard/style';

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
    const author = actors.asObjects[0];
    const date = parseNotificationDate(notification.modifiedAt);
    const context = parseContext(notification.context, currentUser);
    const message =
      notification.entities.length > 0
        ? notification.entities[0].payload
        : null;

    return (
      <NotificationCard>
        <CardLink
          to={{
            pathname: window.location.pathname,
            search: `?thread=${notification.context.id}`,
          }}
        />
        <SpecialContext>
          <Icon glyph="mention" />
          <TextContent pointer={true}>
            {actors.asObjects[0].name} mentioned you in {context.asString}{' '}
            {date}
          </TextContent>
        </SpecialContext>
        <Content>
          <AttachmentsWash>
            {message && (
              <Author style={{ marginTop: '0' }}>
                <AuthorAvatar user={author} />
                <MessageGroup me={false}>
                  <AuthorByline user={author} me={false} />

                  <Message
                    message={message}
                    link={`#${message.id}`}
                    me={false}
                    canModerate={false}
                    pending={message.id < 0}
                    currentUser={currentUser}
                    context={'notification'}
                  />
                </MessageGroup>
              </Author>
            )}
          </AttachmentsWash>
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
