// @flow
import * as React from 'react';
import {
  ChannelContainer,
  ChannelNameLink,
  ChannelName,
  ChannelActions,
} from './style';
import type { ChannelInfoType } from 'shared/graphql/fragments/channel/channelInfo';
import { ChannelHoverProfile } from 'src/components/hoverProfile';

type Props = {
  children: React$Node,
  channel: ChannelInfoType,
};

class ChannelListItem extends React.Component<Props> {
  render() {
    const { channel, children } = this.props;

    return (
      <ChannelContainer>
        <ChannelNameLink to={`/${channel.community.slug}/${channel.slug}`}>
          <ChannelHoverProfile
            id={channel.id}
            style={{ flex: '1 1 auto', maxWidth: 'calc(100% - 32px)' }}
          >
            <ChannelName>{channel.name}</ChannelName>
          </ChannelHoverProfile>
        </ChannelNameLink>

        {children && <ChannelActions>{children}</ChannelActions>}
      </ChannelContainer>
    );
  }
}

export default ChannelListItem;
