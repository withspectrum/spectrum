// @flow
import * as React from 'react';
import { TouchableHighlight, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import compose from 'recompose/compose';
import Facepile from './Facepile';
import ThreadCommunityInfo from './ThreadCommunityInfo';
import {
  InboxThreadItem,
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
      <TouchableHighlight
        onPress={() =>
          this.props.navigation.navigate(`Thread`, {
            id: thread.id,
          })
        }
      >
        <InboxThreadItem>
          <InboxThreadContent>
            <ThreadCommunityInfo
              activeChannel={activeChannel}
              activeCommunity={activeCommunity}
              thread={thread}
            />

            <ThreadTitle>{thread.content.title}</ThreadTitle>

            <ThreadMeta>
              <Facepile
                participants={thread.participants}
                creator={thread.author.user}
                navigation={this.props.navigation}
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
        </InboxThreadItem>
      </TouchableHighlight>
    );
  }
}

export default compose(withNavigation)(ThreadItem);
