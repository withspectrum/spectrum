//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import { withRouter } from 'react-router';
//$FlowFixMe
import compose from 'recompose/compose';
import Icon from '../../../components/icons';
import {
  AllCommunityListItem,
  CommunityListItem,
  CommunityListName,
  CommunityListAvatar,
} from '../style';
import {
  changeActiveCommunity,
  changeActiveThread,
} from '../../../actions/dashboardFeed';

class CommunityList extends Component {
  changeCommunity = id => {
    this.props.dispatch(changeActiveCommunity(id));
    this.props.dispatch(changeActiveThread(''));
  };

  render() {
    const sortedCommunities = this.props.communities.slice().sort((a, b) => {
      const bc = parseInt(b.communityPermissions.reputation, 10);
      const ac = parseInt(a.communityPermissions.reputation, 10);
      return bc <= ac ? -1 : 1;
    });

    return (
      <div>
        <CommunityListItem
          active={!this.props.activeCommunity}
          onClick={() => this.changeCommunity('')}
        >
          <AllCommunityListItem>
            <Icon glyph={'everything'} />
          </AllCommunityListItem>
          <CommunityListName active={!this.props.activeCommunity}>
            All Communities
          </CommunityListName>
        </CommunityListItem>

        {sortedCommunities.map(c => (
          <CommunityListItem
            key={c.id}
            active={c.id === this.props.activeCommunity}
            onClick={() => this.changeCommunity(c.id)}
          >
            <CommunityListAvatar src={c.profilePhoto} />
            <CommunityListName active={c.id === this.props.activeCommunity}>
              {c.name}
            </CommunityListName>
          </CommunityListItem>
        ))}
      </div>
    );
  }
}

export default compose(connect())(CommunityList);
