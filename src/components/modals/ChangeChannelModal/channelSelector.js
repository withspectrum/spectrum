// @flow
import * as React from 'react';
import { getCommunityChannels } from '../../../views/community/queries';
import viewNetworkHandler from '../../viewNetworkHandler';
import ViewError from '../../viewError';
import { LoadingSelect } from '../../loading';
import compose from 'recompose/compose';
import { SelectorContainer } from './style';
import { RequiredSelector } from '../../composer/style';

type ChannelType = {
  node: {
    id: string,
    name: string,
  },
};
type Props = {
  currentChannel: string,
  communitySlug: string,
  setActiveChannel: Function,
  isLoading: boolean,
  data: {
    community: {
      channelConnection: {
        edges: Array<ChannelType>,
      },
    },
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
        n => n.node
      );
      return (
        <SelectorContainer>
          <RequiredSelector onChange={setActiveChannel} value={currentChannel}>
            {availableChannels.map(channel => {
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
