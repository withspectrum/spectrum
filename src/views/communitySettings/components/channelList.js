// @flow
import React from 'react';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Icon from 'src/components/icon';
import { openModal } from 'src/actions/modals';
import { Loading } from 'src/components/loading';
import { ChannelListItem } from 'src/components/listItems';
import { IconButton, Button } from 'src/components/button';
import viewNetworkHandler from 'src/components/viewNetworkHandler';
import ViewError from 'src/components/viewError';
import getCommunityChannels from 'shared/graphql/queries/community/getCommunityChannelConnection';
import type { GetCommunityChannelConnectionType } from 'shared/graphql/queries/community/getCommunityChannelConnection';
import type { Dispatch } from 'redux';
import { ListContainer } from '../style';
import {
  SectionCard,
  SectionTitle,
  SectionCardFooter,
} from 'src/components/settingsViews/style';

type Props = {
  data: {
    community: GetCommunityChannelConnectionType,
  },
  isLoading: boolean,
  dispatch: Dispatch<Object>,
  communitySlug: string,
};

class ChannelList extends React.Component<Props> {
  render() {
    const {
      data: { community },
      isLoading,
      dispatch,
      communitySlug,
    } = this.props;

    if (community) {
      const channels = community.channelConnection.edges.map(c => c && c.node);

      return (
        <SectionCard data-cy="channel-list">
          <SectionTitle>Channels</SectionTitle>

          <ListContainer>
            {channels.length > 0 &&
              channels.map(item => {
                if (!item) return null;
                return (
                  <Link
                    key={item.id}
                    to={`/${communitySlug}/${item.slug}/settings`}
                  >
                    <ChannelListItem contents={item} withDescription={false}>
                      <IconButton>
                        <Icon glyph="settings" />
                      </IconButton>
                    </ChannelListItem>
                  </Link>
                );
              })}
          </ListContainer>

          <SectionCardFooter>
            <Button
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
            </Button>
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
