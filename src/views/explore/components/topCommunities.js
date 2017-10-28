import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
import { getTopCommunities } from '../queries';
import { displayLoadingState } from '../../../components/loading';
import { ListItem, ListTitle, ListWithTitle, ListWrapper } from '../style';
import { CommunityProfile } from '../../../components/profile';

class CommunityList extends Component {
  render() {
    const { data: { topCommunities, error } } = this.props;

    if (!topCommunities || topCommunities.length === 0) return null;

    const sorted = topCommunities
      .slice()
      .sort((a, b) => {
        return b.metaData.members - a.metaData.members;
      })
      .filter(comm => !comm.communityPermissions.isBlocked);

    if (!error && topCommunities.length > 0) {
      return (
        <ListWithTitle>
          <h1>Most popular communities</h1>
          <ListWrapper>
            {sorted.map(community => {
              return (
                <ListItem key={community.id}>
                  <CommunityProfile
                    profileSize={'listItemWithAction'}
                    data={{ community }}
                  />
                </ListItem>
              );
            })}
          </ListWrapper>
        </ListWithTitle>
      );
    }
  }
}

const TopCommunityList = compose(getTopCommunities, displayLoadingState)(
  CommunityList
);
const mapStateToProps = state => ({ currentUser: state.users.currentUser });
export default connect(mapStateToProps)(TopCommunityList);
