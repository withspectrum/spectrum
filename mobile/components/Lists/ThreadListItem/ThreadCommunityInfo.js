// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import { withNavigation } from 'react-navigation';
import { View } from 'react-native';
import TouchableOpacity from '../../TouchableOpacity';
import Avatar from '../../Avatar';
import type { NavigationProps } from 'react-navigation';
import type { ThreadInfoType } from '../../../../shared/graphql/fragments/thread/threadInfo';
import { Subtitle } from '../style';
import {
  ThreadCommunityInfoWrapper,
  ThreadChannelPill,
  ThreadChannelName,
} from './style';

type Props = {
  thread: ThreadInfoType,
  activeChannel?: string,
  activeCommunity?: string,
  navigation: NavigationProps,
};

class ThreadCommunityInfo extends Component<Props> {
  render() {
    const { thread, activeChannel, activeCommunity, navigation } = this.props;
    const { channel, community } = thread;
    const isGeneral = channel.slug === 'general';
    const hideCommunityInfo =
      activeCommunity && activeCommunity === community.id;
    const hideChannelInfo = activeChannel && activeChannel === channel.id;
    if (hideChannelInfo && hideCommunityInfo) return null;

    return (
      <ThreadCommunityInfoWrapper>
        {!hideCommunityInfo && (
          <View style={{ marginRight: 8 }}>
            <Avatar
              src={community.profilePhoto}
              size={20}
              variant="square"
              onPress={() =>
                navigation.navigate({
                  routeName: `Community`,
                  key: community.id,
                  params: { id: community.id },
                })
              }
            />
          </View>
        )}

        {!hideCommunityInfo && (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate({
                routeName: `Community`,
                key: community.id,
                params: { id: community.id },
              })
            }
          >
            <Subtitle>{community.name}</Subtitle>
          </TouchableOpacity>
        )}

        {!hideChannelInfo &&
          !isGeneral && (
            <ThreadChannelPill
              onPress={() =>
                navigation.navigate({
                  routeName: `Channel`,
                  key: channel.id,
                  params: { id: channel.id },
                })
              }
            >
              <ThreadChannelName>{channel.name}</ThreadChannelName>
            </ThreadChannelPill>
          )}
      </ThreadCommunityInfoWrapper>
    );
  }
}

export default compose(withNavigation)(ThreadCommunityInfo);
