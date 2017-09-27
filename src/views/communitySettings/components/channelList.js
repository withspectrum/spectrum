//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
import { openModal } from '../../../actions/modals';
import { LoadingCard } from '../../../components/loading';
import { ChannelListItem } from '../../../components/listItems';
import { IconButton, Button } from '../../../components/buttons';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import ViewError from '../../../components/viewError';
import { getCommunityChannels } from '../queries';
import { StyledCard, ListHeading, ListContainer, ListHeader } from '../style';

type Props = {
  data: {
    community: Object,
  },
  isLoading: boolean,
  dispatch: Function,
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
      const channels = community.channelConnection.edges.map(c => c.node);

      return (
        <StyledCard>
          <ListHeader>
            <ListHeading>Manage Channels</ListHeading>
            <Button
              icon={'plus'}
              onClick={() =>
                dispatch(openModal('CREATE_CHANNEL_MODAL', community))}
            >
              Create Channel
            </Button>
          </ListHeader>
          <ListContainer>
            {channels.length > 0 &&
              channels.map(item => {
                return (
                  <Link
                    key={item.id}
                    to={`/${communitySlug}/${item.slug}/settings`}
                  >
                    <ChannelListItem
                      contents={item}
                      withDescription={false}
                      meta={`${item.metaData.members.toLocaleString()} members`}
                    >
                      <IconButton glyph="settings" />
                    </ChannelListItem>
                  </Link>
                );
              })}
          </ListContainer>
        </StyledCard>
      );
    }

    if (isLoading) {
      return <LoadingCard />;
    }

    return (
      <StyledCard>
        <ViewError
          refresh
          small
          heading={`We couldn’t load the channels for this community.`}
        />
      </StyledCard>
    );
  }
}

export default compose(connect(), getCommunityChannels, viewNetworkHandler)(
  ChannelList
);
