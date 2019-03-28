// @flow
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { openModal } from 'src/actions/modals';
import { Loading } from 'src/components/loading';
import { OutlineButton } from 'src/components/button';
import Icon from 'src/components/icon';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';
import Tooltip from 'src/components/tooltip';
import getCommunityChannels from 'shared/graphql/queries/community/getCommunityChannelConnection';
import type { GetCommunityChannelConnectionType } from 'shared/graphql/queries/community/getCommunityChannelConnection';
import type { Dispatch } from 'redux';
import { ListContainer } from '../style';
import {
  SectionCard,
  SectionTitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';
import { ChannelListItem } from 'src/components/listItems';

type Props = {
  data: {
    community: GetCommunityChannelConnectionType,
  },
  isLoading: boolean,
  dispatch: Dispatch<Object>,
  communitySlug: string,
};

class ChannelList extends React.Component<Props> {
  sortChannelsBySlug = (array: Array<any>): Array<?any> => {
    if (!array || array.length === 0) return [];

    const generalChannel = array.find(channel => channel.slug === 'general');
    const withoutGeneral = array.filter(channel => channel.slug !== 'general');
    const sortedWithoutGeneral = withoutGeneral.sort((a, b) => {
      if (a.slug < b.slug) return -1;
      if (a.slug > b.slug) return 1;
      return 0;
    });
    if (generalChannel) {
      sortedWithoutGeneral.unshift(generalChannel);
      return sortedWithoutGeneral;
    } else {
      return sortedWithoutGeneral;
    }
  };

  sortChannelsByOrderRank = (array: Array<any>): Array<?any> => {
    if (!array || array.length === 0) return [];

    return array.sort((a, b) => {
      // channels with no orderRank will be moved to last
      if (a.orderRank === null || a.orderRank === undefined) return 1;
      if (b.orderRank === null || b.orderRank === undefined) return -1;

      if (a.orderRank < b.orderRank) return -1;
      if (a.orderRank > b.orderRank) return 1;

      return 0;
    });
  };

  sortChannels = (channels: Array<any>): Array<?any> => {
    if (!channels || channels.length === 0) return [];

    const areChannelsHaveOrderRank = channels.some(
      ({ orderRank }) => typeof orderRank === 'number'
    );

    return areChannelsHaveOrderRank
      ? this.sortChannelsByOrderRank(channels)
      : this.sortChannelsBySlug(channels);
  };
  render() {
    const {
      data: { community },
      isLoading,
      dispatch,
    } = this.props;

    if (community) {
      const channels = this.sortChannels(
        community.channelConnection.edges.map(c => c && c.node)
      );

      return (
        <SectionCard data-cy="channel-list">
          <SectionTitle>Channels</SectionTitle>

          <ListContainer style={{ padding: '0 16px' }}>
            {channels.length > 0 &&
              channels.map(channel => {
                if (!channel) return null;
                return (
                  <ChannelListItem key={channel.id} channel={channel}>
                    <Link
                      to={`/${channel.community.slug}/${channel.slug}/settings`}
                    >
                      <Tooltip content={'Manage channel'}>
                        <span>
                          <Icon glyph="settings" />
                        </span>
                      </Tooltip>
                    </Link>
                  </ChannelListItem>
                );
              })}
          </ListContainer>

          <SectionCardFooter>
            <OutlineButton
              style={{ alignSelf: 'flex-start' }}
              icon={'plus'}
              onClick={() =>
                dispatch(
                  openModal('CREATE_CHANNEL_MODAL', {
                    community,
                    id: community.id,
                  })
                )
              }
              data-cy="create-channel-button"
            >
              Create Channel
            </OutlineButton>
          </SectionCardFooter>
        </SectionCard>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return (
      <SectionCard>
        <ViewError
          refresh
          small
          heading={'We couldn’t load the channels for this community.'}
        />
      </SectionCard>
    );
  }
}

export default compose(
  connect(),
  getCommunityChannels,
  viewNetworkHandler
)(ChannelList);
