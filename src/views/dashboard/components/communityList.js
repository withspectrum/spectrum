//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import { withRouter } from 'react-router';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import { Link } from 'react-router-dom';
import Icon from '../../../components/icons';
import { Avatar } from '../../../components/avatar';
import {
  ExploreListItem,
  AllCommunityListItem,
  ExploreCommunityListItem,
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
    const { user, activeCommunity, communities } = this.props;

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
          <AllCommunityListItem active={!activeCommunity}>
            <Icon glyph={'everything'} />
          </AllCommunityListItem>
          <CommunityListName active={!activeCommunity}>
            Everything
          </CommunityListName>
        </CommunityListItem>

        {sortedCommunities.map(c => (
          <CommunityListItem
            key={c.id}
            active={c.id === activeCommunity}
            onClick={() => this.changeCommunity(c.id)}
          >
            <CommunityListAvatar
              active={c.id === activeCommunity}
              src={c.profilePhoto}
            />
            <CommunityListName active={c.id === activeCommunity}>
              {c.name}
            </CommunityListName>
          </CommunityListItem>
        ))}

        <ExploreCommunityListItem>
          <Link to={`/explore`}>
            <ExploreListItem>
              <Icon glyph={'plus'} size={40} />
            </ExploreListItem>
            <CommunityListName>Explore communities</CommunityListName>
          </Link>
        </ExploreCommunityListItem>
      </div>
    );
  }
}

export default compose(connect())(CommunityList);
