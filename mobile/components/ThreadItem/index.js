// @flow
import * as React from 'react';
import { TouchableHighlight, Image, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import compose from 'recompose/compose';
// import Facepile from './Facepile'
import ThreadCommunityInfo from './ThreadCommunityInfo';
import Text from '../Text';
import {
  InboxThreadItem,
  InboxThreadContent,
  ThreadTitle,
  ThreadMeta,
  MetaText,
  MetaTextPill,
} from './style';
import { truncate } from './utils';
import type { ThreadInfoType } from '../../../shared/graphql/fragments/thread/threadInfo';

type Props = {
  thread: ThreadInfoType,
  navigation: Object,
};

class ThreadItem extends React.Component<Props> {
  render() {
    const { thread } = this.props;

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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image
                source={{ uri: thread.community.profilePhoto }}
                style={{
                  height: 15,
                  width: 15,
                  marginRight: 8,
                  borderRadius: 4,
                }}
              />
              <Text type="subhead" style={{ marginTop: 0 }}>
                {thread.community.name} / {thread.channel.name}
              </Text>
            </View>
            <Text type="headline">{thread.content.title}</Text>

            <ThreadMeta>
              {/*<Facepile
                participants={thread.participants}
                creator={thread.creator}
              />*/}

              {thread.messageCount > 0 ? (
                <Text type="caption1">
                  {thread.messageCount > 1
                    ? `${thread.messageCount} messages`
                    : `${thread.messageCount} message`}
                </Text>
              ) : (
                <MetaTextPill offset={thread.participants.length} new>
                  New thread!
                </MetaTextPill>
              )}
            </ThreadMeta>
          </InboxThreadContent>
        </InboxThreadItem>
      </TouchableHighlight>
    );
  }
}

export default compose(withNavigation)(ThreadItem);
