import * as React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
import { getThreadById } from '../../../api/thread';
import { sortByDate } from '../../../helpers/utils';
import { displayLoadingCard } from '../../../components/loading';
import { parseNotificationDate, parseContext } from '../utils';
import Icon from '../../../components/icons';
import { ThreadProfile } from '../../../components/profile';
import {
  SegmentedNotificationCard,
  TextContent,
  SegmentedNotificationListRow,
  AttachmentsWash,
  ThreadContext,
  ContentWash,
} from '../style';

type Props = {
  notification: Object,
  currentUser: Object,
  history: Object,
};
type State = {
  communityName: string,
};

const sortThreads = (entities, currentUser) => {
  // filter out the current user's threads
  let threads = entities.filter(
    thread => thread.payload.creatorId !== currentUser.id
  );

  // create an array of payloads
  threads = threads && threads.map(thread => thread.payload);

  // sort the threads by created at date
  threads = threads && sortByDate(threads, 'createdAt', 'desc');

  return threads;
};

const ThreadCreatedComponent = ({ data, ...rest }) => {
  return <ThreadProfile profileSize="mini" data={data} {...rest} />;
};

const ThreadCreated = compose(getThreadById, displayLoadingCard)(
  ThreadCreatedComponent
);

/*
  NOTE: @brianlovin
  These new thread notifications are handled with a contextId that matches a *channel*. This means that we can't easily access community information within the notification.

  However, because this notification fetches thread data, we will get community info back from the response! I use a slightly hacky component state + props to bubble the community name up from the ThreadCreated component whenever the data fetches, then use that to set local component state to show the community name in the notification.
*/

export class NewThreadNotification extends React.Component<Props, State> {
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

    const date = parseNotificationDate(notification.modifiedAt);
    const context = parseContext(notification.context);

    // sort and order the threads
    const threads = sortThreads(notification.entities, currentUser);

    const newThreadCount =
      threads.length > 1 ? `New threads were` : 'A new thread was';

    if (threads && threads.length > 0) {
      return (
        <SegmentedNotificationCard>
          <ThreadContext>
            <Icon glyph="post-fill" />
            <TextContent pointer={true}>
              {newThreadCount} published in{' '}
              {communityName && `${communityName}, `} {context.asString} {date}
            </TextContent>
          </ThreadContext>
          <ContentWash>
            <AttachmentsWash>
              {threads.map(thread => {
                return (
                  <ThreadCreated
                    setName={this.setCommunityName}
                    key={thread.id}
                    id={thread.id}
                  />
                );
              })}
            </AttachmentsWash>
          </ContentWash>
        </SegmentedNotificationCard>
      );
    } else {
      return null;
    }
  }
}

export class MiniNewThreadNotification extends React.Component<Props, State> {
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

    const date = parseNotificationDate(notification.modifiedAt);
    const context = parseContext(notification.context);

    const threads = sortThreads(notification.entities, currentUser);

    const newThreadCount =
      threads.length > 1 ? `New threads were` : 'A new thread was';

    if (threads && threads.length > 0) {
      return (
        <SegmentedNotificationListRow>
          <ThreadContext>
            <Icon glyph="post-fill" />
            <TextContent pointer={false}>
              {newThreadCount} published in{' '}
              {communityName && `${communityName}, `} {context.asString} {date}
            </TextContent>
          </ThreadContext>
          <ContentWash mini>
            <AttachmentsWash>
              {threads.map(thread => {
                return (
                  <ThreadCreated
                    setName={this.setCommunityName}
                    key={thread.id}
                    id={thread.id}
                  />
                );
              })}
            </AttachmentsWash>
          </ContentWash>
        </SegmentedNotificationListRow>
      );
    } else {
      return null;
    }
  }
}
