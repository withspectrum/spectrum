// @flow
import * as React from 'react';
import getCommunityChannels from 'shared/graphql/queries/community/getCommunityChannelConnection';
import type { GetCommunityChannelConnectionType } from 'shared/graphql/queries/community/getCommunityChannelConnection';
import viewNetworkHandler from '../../viewNetworkHandler';
import ViewError from '../../viewError';
import { LoadingSelect } from '../../loading';
import compose from 'recompose/compose';
import { SelectorContainer } from './style';
import { RequiredSelector } from '../../composer/style';

type Props = {
  currentChannel: string,
  communitySlug: string,
  setActiveChannel: Function,
  isLoading: boolean,
  data: {
    community: GetCommunityChannelConnectionType,
  },
};
class ChannelSelector extends React.Component<Props> {
  render() {
    const { isLoading, currentChannel, data, setActiveChannel } = this.props;

    if (
      data &&
      data.community &&
      data.community.channelConnection &&
      data.community.channelConnection.edges.length > 0
    ) {
      const availableChannels = data.community.channelConnection.edges.map(
        n => n && n.node
      );
      const channels = availableChannels
        .filter(channel => {
          if (!channel) return null;
          if (channel.isPrivate && !channel.channelPermissions.isMember)
            return null;

          return channel;
        })
        .filter(channel => channel && !channel.channelPermissions.isBlocked)
        .filter(channel => channel && !channel.isArchived);

      return (
        <SelectorContainer>
          <RequiredSelector onChange={setActiveChannel} value={currentChannel}>
            {channels.map(channel => {
              if (!channel) return null;
              return (
                <option key={channel.id} value={channel.id}>
                  {channel.name}
                </option>
              );
            })}
          </RequiredSelector>
        </SelectorContainer>
      );
    }

    if (isLoading) {
      return (
        <SelectorContainer>
          <LoadingSelect />
        </SelectorContainer>
      );
    }

    return (
      <ViewError
        heading={"We couldn't fetch this community's channels."}
        refresh
        small
      />
    );
  }
}

export default compose(getCommunityChannels, viewNetworkHandler)(
  ChannelSelector
);
