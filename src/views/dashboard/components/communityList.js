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
  AllCommunityListItem,
  CommunityListItem,
  CommunityListName,
  CommunityListAvatar,
  CommunityListDivider,
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
        <Link to={`/users/${user.username}`}>
          <CommunityListItem>
            <Avatar src={user.profilePhoto} size={32} />
            <CommunityListName>{user.name}</CommunityListName>
          </CommunityListItem>
        </Link>

        <CommunityListDivider />

        <CommunityListItem
          active={!activeCommunity}
          onClick={() => this.changeCommunity('')}
        >
          <AllCommunityListItem>
            <Icon glyph={'everything'} />
          </AllCommunityListItem>
          <CommunityListName active={!activeCommunity}>
            All Communities
          </CommunityListName>
        </CommunityListItem>

        {sortedCommunities.map(c => (
          <CommunityListItem
            key={c.id}
            active={c.id === activeCommunity}
            onClick={() => this.changeCommunity(c.id)}
          >
            <CommunityListAvatar src={c.profilePhoto} />
            <CommunityListName active={c.id === activeCommunity}>
              {c.name}
            </CommunityListName>
          </CommunityListItem>
        ))}
      </div>
    );
  }
}

export default compose(connect())(CommunityList);
