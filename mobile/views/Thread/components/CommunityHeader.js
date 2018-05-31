// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import Avatar from '../../../components/Avatar';
import TouchableOpacity from '../../../components/TouchableOpacity';
import { withNavigation } from 'react-navigation';
import type { Navigation } from '../../../utils/types';
import type { ThreadInfoType } from '../../../../shared/graphql/fragments/thread/threadInfo';
import {
  CommunityHeaderContainer,
  CommunityName,
  ThreadChannelName,
  ThreadChannelPill,
} from '../style';

type Props = {
  thread: ThreadInfoType,
  navigation: Navigation,
};

class CommunityHeader extends Component<Props> {
  render() {
    const { thread, navigation } = this.props;
    const { channel, community } = thread;
    const isGeneral = channel.slug === 'general';
    return (
      <CommunityHeaderContainer>
        <Avatar
          src={thread.community.profilePhoto}
          size={32}
          variant="square"
          onPress={() =>
            navigation.navigate({
              routeName: `Community`,
              key: thread.community.id,
              params: { id: thread.community.id },
            })
          }
        />

        <TouchableOpacity
          onPress={() =>
            navigation.navigate({
              routeName: `Community`,
              key: community.id,
              params: { id: community.id },
            })
          }
        >
          <CommunityName>{community.name}</CommunityName>
        </TouchableOpacity>

        {!isGeneral && (
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
      </CommunityHeaderContainer>
    );
  }
}

export default compose(withNavigation)(CommunityHeader);
