import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
import { getTopCommunities } from '../../../../api/community';
import { displayLoadingState } from '../../../../components/loading';
import { Row } from './style';
import { CommunityProfile } from '../../../../components/profile';

class TopCommunitiesPure extends Component {
  render() {
    const { data: { topCommunities, error }, hasJoined } = this.props;
    // don't display communities where the user is blocked
    const filteredCommunities = topCommunities.filter(
      community => !community.communityPermissions.isBlocked
    );

    if (!error && filteredCommunities.length > 0) {
      return (
        <Row hasJoined={hasJoined > 0}>
          {filteredCommunities.map(community => {
            return (
              <CommunityProfile
                profileSize={'upsell'}
                data={{ community }}
                key={community.id}
              />
            );
          })}
        </Row>
      );
    }
  }
}

const TopCommunities = compose(
  getTopCommunities,
  displayLoadingState,
  connect()
)(TopCommunitiesPure);
export default TopCommunities;
