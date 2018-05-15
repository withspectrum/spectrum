// @flow
import * as React from 'react';
import { TouchableHighlight, Image, View } from 'react-native';
import { withNavigation } from 'react-navigation';
import compose from 'recompose/compose';
import Facepile from './Facepile';
import Text from '../Text';
import {
  InboxThreadItem,
  InboxThreadContent,
  ThreadMeta,
  MetaTextPill,
} from './style';
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
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 5,
              }}
            >
              <Image
                source={{ uri: thread.community.profilePhoto }}
                style={{
                  height: 20,
                  width: 20,
                  marginRight: 8,
                  borderRadius: 5,
                }}
              />
              <Text type="subhead" style={{ marginTop: 0 }}>
                {thread.community.name} / {thread.channel.name}
              </Text>
            </View>
            <Text type="headline">{thread.content.title}</Text>

            <ThreadMeta>
              <Facepile
                participants={thread.participants}
                creator={thread.author.user}
                navigation={this.props.navigation}
              />

              {thread.messageCount > 0 ? (
                <Text type="caption1">
                  {thread.messageCount > 1
                    ? `${thread.messageCount} messages`
                    : `${thread.messageCount} message`}
                </Text>
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
