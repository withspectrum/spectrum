// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { getThreadById } from 'shared/graphql/queries/thread/getThread';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import { sortByDate } from 'src/helpers/utils';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import { parseNotificationDate, parseContext } from '../utils';
import markSingleNotificationSeenMutation from 'shared/graphql/mutations/notification/markSingleNotificationSeen';
import Icon from 'src/components/icons';
import { ThreadProfile } from 'src/components/profile';
import { LoadingCard } from 'src/components/loading';
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
  history?: Object,
  markSingleNotificationSeen?: Function,
  markSingleNotificationAsSeenInState?: Function,
};
type State = {
  communityName: string,
  deletedThreads: Array<?string>,
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

const ThreadCreatedComponent = ({
  data,
  ...rest
}: {
  data: { thread: GetThreadType },
}) => {
  if (rest.isLoading) return <LoadingCard />;
  return <ThreadProfile profileSize="mini" data={data} {...rest} />;
};

const ThreadCreated = compose(getThreadById, viewNetworkHandler)(
  ThreadCreatedComponent
);

/*
  NOTE: @brianlovin
  These new thread notifications are handled with a contextId that matches a *channel*. This means that we can't easily access community information within the notification.

  However, because this notification fetches thread data, we will get community info back from the response! I use a slightly hacky component state + props to bubble the community name up from the ThreadCreated component whenever the data fetches, then use that to set local component state to show the community name in the notification.
*/

export class NewThreadNotification extends React.Component<Props, State> {
  state = {
    communityName: '',
    deletedThreads: [],
  };

  setCommunityName = (name: string) => this.setState({ communityName: name });

  markAsDeleted = (id: string) => {
    const newArr = this.state.deletedThreads.concat(id);
    setTimeout(() => {
      this.setState({ deletedThreads: newArr });
    }, 0);
  };

  render() {
    const { notification, currentUser } = this.props;
    const { communityName, deletedThreads } = this.state;

    const date = parseNotificationDate(notification.modifiedAt);
    const context = parseContext(notification.context);

    // sort and order the threads
    const threads = sortThreads(notification.entities, currentUser).filter(
      thread => deletedThreads.indexOf(thread.id) < 0
    );

    const newThreadCount =
      threads.length > 1 ? 'New threads were' : 'A new thread was';

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
                    markAsDeleted={this.markAsDeleted}
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

class MiniNewThreadNotificationWithMutation extends React.Component<
  Props,
  State
> {
  state = {
    communityName: '',
    deletedThreads: [],
  };

  markAsDeleted = (id: string) => {
    const newArr = this.state.deletedThreads.concat(id);
    setTimeout(() => {
      this.setState({ deletedThreads: newArr });
    }, 0);
    this.markAsSeen();
  };

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

  setCommunityName = (name: string) => this.setState({ communityName: name });

  render() {
    const { notification, currentUser } = this.props;
    const { communityName, deletedThreads } = this.state;

    const date = parseNotificationDate(notification.modifiedAt);
    const context = parseContext(notification.context);

    const threads = sortThreads(notification.entities, currentUser).filter(
      thread => deletedThreads.indexOf(thread.id) < 0
    );

    const newThreadCount =
      threads.length > 1 ? 'New threads were' : 'A new thread was';

    if (threads && threads.length > 0) {
      return (
        <SegmentedNotificationListRow
          isSeen={notification.isSeen}
          onClick={this.markAsSeen}
        >
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
                    markAsDeleted={this.markAsDeleted}
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

export const MiniNewThreadNotification = compose(
  markSingleNotificationSeenMutation
)(MiniNewThreadNotificationWithMutation);
