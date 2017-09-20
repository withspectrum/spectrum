//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import { withRouter } from 'react-router';
//$FlowFixMe
import compose from 'recompose/compose';
import {
  AllCommunityListItem,
  CommunityListItem,
  CommunityListAvatar,
} from '../style';
import { changeActiveCommunity } from '../../../actions/dashboardFeed';

class CommunityList extends Component {
  render() {
    const sortedCommunities = this.props.communities.slice().sort((a, b) => {
      const bc = parseInt(b.communityPermissions.reputation, 10);
      const ac = parseInt(a.communityPermissions.reputation, 10);
      return bc <= ac ? -1 : 1;
    });

    return (
      <div>
        <AllCommunityListItem
          tipText={'All communities'}
          tipLocation={'right'}
          active={!this.props.activeCommunity}
          onClick={() => this.props.dispatch(changeActiveCommunity(''))}
        />

        {sortedCommunities.map(c => (
          <CommunityListItem
            key={c.id}
            tipText={c.name}
            tipLocation={'right'}
            active={c.id === this.props.activeCommunity}
            onClick={() => this.props.dispatch(changeActiveCommunity(c.id))}
          >
            <CommunityListAvatar src={c.profilePhoto} />
          </CommunityListItem>
        ))}
      </div>
    );
  }
}

export default compose(connect())(CommunityList);
