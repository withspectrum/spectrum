import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import Icon from '../../../components/icons';
import { ReputationMiniCommunity } from '../../../components/reputation';
import { truncateNumber } from '../../../helpers/utils';
import SidebarChannels from './sidebarChannels';
import UpsellExploreCommunities from './upsellExploreCommunities';
import {
  AllCommunityListItem,
  ExploreCommunityListItem,
  CommunityListItem,
  CommunityListText,
  CommunityListName,
  CommunityListReputation,
  CommunityListAvatar,
  CommunityListPadding,
  Fixed,
} from '../style';
import {
  changeActiveCommunity,
  changeActiveThread,
  changeActiveChannel,
} from '../../../actions/dashboardFeed';

class CommunityList extends Component {
  changeCommunity = id => {
    this.props.dispatch(changeActiveCommunity(id));
    this.props.history.replace(`/`);
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

  render() {
    const {
      activeCommunity,
      activeChannel,
      communities,
      isHovered,
      user,
    } = this.props;
    const sortedCommunities = communities.slice().sort((a, b) => {
      const bc = parseInt(b.communityPermissions.reputation, 10);
      const ac = parseInt(a.communityPermissions.reputation, 10);
      return bc <= ac ? -1 : 1;
    });

    return (
      <div>
        <CommunityListItem
          active={!activeCommunity}
          onClick={() => this.changeCommunity('')}
        >
          <CommunityListPadding>
            <AllCommunityListItem active={!activeCommunity}>
              <Icon glyph={'everything'} />
            </AllCommunityListItem>
            <CommunityListText>
              <CommunityListName active={!activeCommunity}>
                Everything
              </CommunityListName>
              <CommunityListReputation>
                <ReputationMiniCommunity
                  tipLocation={'bottom-right'}
                  tipText={'Your total reputation'}
                />
                {user.totalReputation > 0
                  ? truncateNumber(user.totalReputation)
                  : '0'}{' '}
                total rep
              </CommunityListReputation>
            </CommunityListText>
          </CommunityListPadding>
        </CommunityListItem>

        {sortedCommunities.map(c => (
          <CommunityListItem key={c.id} active={c.id === activeCommunity}>
            <CommunityListPadding
              onClick={() => this.handleOnClick(c.id)}
              active={c.id === activeCommunity}
            >
              <CommunityListAvatar
                active={c.id === activeCommunity}
                src={c.profilePhoto}
              />
              <CommunityListText>
                <CommunityListName
                  active={!activeChannel && c.id === activeCommunity}
                >
                  {c.name}
                </CommunityListName>
                <CommunityListReputation active={c.id === activeCommunity}>
                  <ReputationMiniCommunity />
                  {truncateNumber(c.communityPermissions.reputation)}
                </CommunityListReputation>
              </CommunityListText>
            </CommunityListPadding>

            {c.id === activeCommunity && (
              <SidebarChannels
                activeChannel={activeChannel}
                communitySlug={c.slug}
                isHovered={isHovered}
              />
            )}
          </CommunityListItem>
        ))}

        {// if user has joined less than 5 communities, upsell some popular ones
        communities.length < 5 && (
          <UpsellExploreCommunities
            activeCommunity={activeCommunity}
            communities={communities}
            handleOnClick={this.handleOnClick}
          />
        )}

        {// if user has joined more than 5 communities, show a small fixed upsell for explore
        communities.length > 5 && (
          <Fixed>
            <ExploreCommunityListItem>
              <Link to={'/explore'}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <AllCommunityListItem>
                    <Icon glyph={'explore'} />
                  </AllCommunityListItem>
                  <CommunityListName>Explore communities</CommunityListName>
                </div>
              </Link>
            </ExploreCommunityListItem>
          </Fixed>
        )}
      </div>
    );
  }
}

export default compose(connect(), withRouter)(CommunityList);
