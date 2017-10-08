import React, { Component } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { Link } from 'react-router-dom';
import Icon from '../../../components/icons';
import { ReputationMiniCommunity } from '../../../components/reputation';
import { truncateNumber } from '../../../helpers/utils';
import SidebarChannels from './sidebarChannels';
import {
  ExploreListItem,
  AllCommunityListItem,
  ExploreCommunityListItem,
  CommunityListItem,
  CommunityListText,
  CommunityListName,
  CommunityListReputation,
  CommunityListAvatar,
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
    this.props.dispatch(changeActiveThread(''));

    if (id !== this.props.activeCommunity) {
      this.props.dispatch(changeActiveChannel(''));
    }
  };

  clearActiveChannel = () => {
    this.props.dispatch(changeActiveThread(''));
    this.props.dispatch(changeActiveChannel(''));
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
          </div>
        </CommunityListItem>

        {sortedCommunities.map(c => (
          <CommunityListItem
            key={c.id}
            active={c.id === activeCommunity}
            onClick={() => this.changeCommunity(c.id)}
          >
            <div style={{ display: 'flex' }}>
              <CommunityListAvatar
                active={c.id === activeCommunity}
                src={c.profilePhoto}
                onClick={this.clearActiveChannel}
              />
              <CommunityListText>
                <CommunityListName
                  active={!activeChannel && c.id === activeCommunity}
                  onClick={this.clearActiveChannel}
                >
                  {c.name}
                </CommunityListName>
                <CommunityListReputation active={c.id === activeCommunity}>
                  <ReputationMiniCommunity />
                  {truncateNumber(c.communityPermissions.reputation)}
                </CommunityListReputation>
              </CommunityListText>
            </div>

            {c.id === activeCommunity && (
              <SidebarChannels
                activeChannel={activeChannel}
                communitySlug={c.slug}
                isHovered={isHovered}
              />
            )}
          </CommunityListItem>
        ))}

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
      </div>
    );
  }
}

export default compose(connect())(CommunityList);
