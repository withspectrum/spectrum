// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { getThreadById } from 'shared/graphql/queries/thread/getThread';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import { displayLoadingCard } from 'src/components/loading';
import { parseNotificationDate, parseContext, parseActors } from '../utils';
import Icon from 'src/components/icon';
import { ThreadProfile } from 'src/components/profile';
import {
  SegmentedNotificationCard,
  TextContent,
  AttachmentsWash,
  ContentWash,
  SpecialContext,
  ThreadContext,
} from '../style';

type Props = {
  notification: Object,
  currentUser: Object,
  history?: Object,
  markSingleNotificationSeen: Function,
};
type State = {
  communityName: string,
};

const ThreadComponent = ({
  data,
  ...rest
}: {
  data: { thread: GetThreadType },
}) => {
  return <ThreadProfile profileSize="mini" data={data} {...rest} />;
};

const ThreadCreated = compose(
  getThreadById,
  displayLoadingCard
)(ThreadComponent);

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
    const {
      notification,
      currentUser,
      markSingleNotificationSeen,
    } = this.props;

    const actors = parseActors(notification.actors, currentUser, false);
    const date = parseNotificationDate(notification.modifiedAt);
    const context = parseContext(notification.context, currentUser);

    return (
      <SegmentedNotificationCard
        onClick={() => markSingleNotificationSeen(notification.id)}
        isSeen={notification.isSeen}
      >
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
