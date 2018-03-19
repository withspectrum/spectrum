// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import Link from 'src/components/link';
import Icon from '../../../components/icons';
import Reputation from '../../../components/reputation';
import SidebarChannels from './sidebarChannels';
import UpsellExploreCommunities from './upsellExploreCommunities';
import {
  CommunityListItem,
  CommunityListMeta,
  CommunityListName,
  CommunityListAvatar,
  CommunityListScroller,
  CommunityListWrapper,
  Fixed,
} from '../style';
import {
  changeActiveCommunity,
  changeActiveThread,
  changeActiveChannel,
} from '../../../actions/dashboardFeed';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';

type Props = {
  dispatch: Function,
  history: Object,
  activeCommunity: ?string,
  activeChannel: ?string,
  communities: Array<GetCommunityType>,
};

class CommunityList extends React.Component<Props> {
  changeCommunity = id => {
    this.props.dispatch(changeActiveCommunity(id));
    this.props.history.replace('/');
    this.props.dispatch(changeActiveThread(''));

    if (id !== this.props.activeCommunity) {
      this.props.dispatch(changeActiveChannel(''));
    }
  };

  clearActiveChannel = () => {
    this.props.dispatch(changeActiveThread(''));
    this.props.dispatch(changeActiveChannel(''));
  };

  handleOnClick = id => {
    this.clearActiveChannel();
    if (this.props.activeCommunity !== id) {
      this.changeCommunity(id);
    }
  };

  shouldComponentUpdate(nextProps) {
    const curr = this.props;

    const changedActiveCommunity =
      curr.activeCommunity !== nextProps.activeCommunity;
    const changedActiveChannel = curr.activeChannel !== nextProps.activeChannel;
    const changedCommunitiesAmount =
      curr.communities.length !== nextProps.communities.length;

    if (
      changedActiveCommunity ||
      changedActiveChannel ||
      changedCommunitiesAmount
    ) {
      return true;
    }
    return false;
  }

  render() {
    const { activeCommunity, activeChannel, communities } = this.props;
    const sortedCommunities = communities.slice().sort((a, b) => {
      const bc = parseInt(b.communityPermissions.reputation, 10);
      const ac = parseInt(a.communityPermissions.reputation, 10);
      return bc <= ac ? -1 : 1;
    });

    return (
      <CommunityListWrapper data-e2e-id="inbox-community-list">
        <CommunityListScroller>
          <CommunityListItem
            active={!activeCommunity}
            onClick={() => this.changeCommunity('')}
          >
            <Icon glyph={'everything'} />
            <CommunityListName>Everything</CommunityListName>
          </CommunityListItem>
          {sortedCommunities.map(c => (
            <CommunityListItem
              key={c.id}
              onClick={() => this.handleOnClick(c.id)}
              active={c.id === activeCommunity}
            >
              <CommunityListAvatar
                active={c.id === activeCommunity}
                src={c.profilePhoto}
              />
              <CommunityListMeta>
                <CommunityListName>{c.name}</CommunityListName>
                <Reputation
                  ignoreClick
                  size={'mini'}
                  tipText={`Rep in ${c.name}`}
                  reputation={c.communityPermissions.reputation}
                />
              </CommunityListMeta>

              {c.id === activeCommunity && (
                <SidebarChannels
                  activeChannel={activeChannel}
                  communitySlug={c.slug}
                  thisCommunity={c}
                  id={c.id}
                />
              )}
            </CommunityListItem>
          ))}
        </CommunityListScroller>

        <Fixed>
          <Link to={'/explore'}>
            <CommunityListItem>
              <Icon glyph={'explore'} />
              <CommunityListName>Find more communities</CommunityListName>
            </CommunityListItem>
          </Link>
          {// if user has joined less than 5 communities, upsell some popular ones
          communities.length < 5 && (
            <UpsellExploreCommunities
              activeCommunity={activeCommunity}
              communities={communities}
              handleOnClick={this.handleOnClick}
              curatedContentType={'top-communities-by-members'}
            />
          )}
        </Fixed>
      </CommunityListWrapper>
    );
  }
}

export default compose(connect(), withRouter)(CommunityList);
