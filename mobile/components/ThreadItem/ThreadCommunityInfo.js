// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { withNavigation } from 'react-navigation';
import { View, TouchableOpacity } from 'react-native';
import Avatar from '../Avatar';
import type { Navigation } from '../../utils/types';
import type { ThreadInfoType } from '../../../shared/graphql/fragments/thread/threadInfo';
import {
  ThreadCommunityInfoWrapper,
  ThreadCommunityName,
  ThreadChannelPill,
  ThreadChannelName,
} from './style';

type Props = {
  thread: ThreadInfoType,
  activeChannel?: string,
  activeCommunity?: string,
  navigation: Navigation,
};

class ThreadCommunityInfo extends React.Component<Props> {
  render() {
    const { thread, activeChannel, activeCommunity, navigation } = this.props;
    const { channel, community } = thread;
    const isGeneral = channel.slug === 'general';
    const hideCommunityInfo =
      activeCommunity && activeCommunity === community.id;
    const hideChannelInfo = activeChannel && activeChannel === channel.id;

    if (hideCommunityInfo && !activeChannel) return null;
    if (hideChannelInfo && hideCommunityInfo) return null;

    return (
      <ThreadCommunityInfoWrapper>
        {!hideCommunityInfo && (
          <View style={{ marginRight: 4 }}>
            <Avatar
              src={community.profilePhoto}
              size={20}
              radius={4}
              navigate={() =>
                navigation.navigate(`Community`, { id: community.id })
              }
            />
          </View>
        )}

        {!hideCommunityInfo && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(`Community`, { id: community.id })
            }
          >
            <ThreadCommunityName>{community.name}</ThreadCommunityName>
          </TouchableOpacity>
        )}

        {!hideChannelInfo &&
          !isGeneral && (
            <ThreadChannelPill
              onPress={() => navigation.navigate(`Channel`, { id: channel.id })}
            >
              <ThreadChannelName>{channel.name}</ThreadChannelName>
            </ThreadChannelPill>
          )}
      </ThreadCommunityInfoWrapper>
    );
  }
}

export default compose(withNavigation)(ThreadCommunityInfo);
