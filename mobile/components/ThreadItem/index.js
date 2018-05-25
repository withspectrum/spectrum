// @flow
import * as React from 'react';
import { View } from 'react-native';
import { withNavigation } from 'react-navigation';
import compose from 'recompose/compose';
import Facepile from '../../components/Facepile';
import { ListItem } from '../Lists';
import ThreadCommunityInfo from './ThreadCommunityInfo';
import {
  InboxThreadContent,
  ThreadTitle,
  ThreadMeta,
  MetaTextPill,
  MessageCount,
} from './style';
import type { ThreadInfoType } from '../../../shared/graphql/fragments/thread/threadInfo';

type Props = {
  thread: ThreadInfoType,
  navigation: Object,
  activeChannel?: string,
  activeCommunity?: string,
};

class ThreadItem extends React.Component<Props> {
  render() {
    const { thread, activeChannel, activeCommunity } = this.props;

    if (!thread.id) return null;

    return (
      <ListItem
        onPress={() =>
          this.props.navigation.navigate(`Thread`, {
            id: thread.id,
          })
        }
      >
        <InboxThreadContent>
          <ThreadCommunityInfo
            activeChannel={activeChannel}
            activeCommunity={activeCommunity}
            thread={thread}
          />

          <ThreadTitle>{thread.content.title}</ThreadTitle>

          <ThreadMeta>
            <Facepile
              users={thread.participants.filter(
                participant =>
                  participant && participant.id !== thread.author.user.id
              )}
              insertAtFirstPosition={thread.author.user}
            />

            {thread.messageCount > 0 ? (
              <MessageCount>
                {thread.messageCount > 1
                  ? `${thread.messageCount} messages`
                  : `${thread.messageCount} message`}
              </MessageCount>
            ) : (
              <View>
                <MetaTextPill offset={thread.participants.length} new>
                  {'New thread!'.toUpperCase()}
                </MetaTextPill>
              </View>
            )}
          </ThreadMeta>
        </InboxThreadContent>
      </ListItem>
    );
  }
}

export default compose(withNavigation)(ThreadItem);
