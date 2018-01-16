// @flow
import * as React from 'react';
import { TouchableHighlight } from 'react-native';
// import Facepile from './Facepile'
import ThreadCommunityInfo from './ThreadCommunityInfo';
import {
  InboxThreadItem,
  InboxThreadContent,
  ThreadTitle,
  ThreadMeta,
  MetaText,
  MetaTextPill,
} from './style';
import { truncate } from './utils';

type UserType = {
  id: string,
  username: string,
  name: string,
  profilePhoto: string,
};
type CommunityType = {
  id: string,
  name: string,
};
type ChannelType = {
  id: string,
  name: string,
};
type ThreadType = {
  id: string,
  createdAt: Date,
  modifiedAt: Date,
  channel: ChannelType,
  community: CommunityType,
  content: {
    title: string,
    body: string,
  },
  isLocked: boolean,
  isCreator: boolean,
  receiveNotifications: boolean,
  lastActive: Date,
  participants: Array<?UserType>,
  creator: UserType,
  watercooler: boolean,
  currentUserLastSeen: Date,
  messageCount: number,
};
type Props = {
  thread: ThreadType,
  navigation: Object,
};

class ThreadItem extends React.Component<Props> {
  render() {
    const { thread } = this.props;

    return (
      <InboxThreadItem>
        <TouchableHighlight
          onPress={() =>
            this.props.navigation.navigate(`Thread`, {
              id: thread.id,
            })
          }
        >
          <InboxThreadContent>
            <ThreadCommunityInfo
              thread={thread}
              // activeCommunity={hasActiveCommunity}
              // activeChannel={hasActiveChannel}
              // isPinned={isPinned}
            />

            <ThreadTitle>{truncate(thread.content.title, 80)}</ThreadTitle>

            <ThreadMeta>
              {/*<Facepile
                participants={thread.participants}
                creator={thread.creator}
              />*/}

              {thread.messageCount > 0 ? (
                <MetaText offset={thread.participants.length}>
                  {thread.messageCount > 1
                    ? `${thread.messageCount} messages`
                    : `${thread.messageCount} message`}
                </MetaText>
              ) : (
                <MetaTextPill offset={thread.participants.length} new>
                  New thread!
                </MetaTextPill>
              )}
            </ThreadMeta>
          </InboxThreadContent>
        </TouchableHighlight>
      </InboxThreadItem>
    );
  }
}

export default ThreadItem;
