import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
import { track } from '../../../../helpers/events';
import { getTopCommunities } from '../../../../api/community';
import { toggleCommunityMembershipMutation } from '../../../../api/community';
import { addToastWithTimeout } from '../../../../actions/toasts';
import { displayLoadingState } from '../../../../components/loading';
import { Button, OutlineButton } from '../../../../components/buttons';
import { Row } from './style';
import { CommunityProfile } from '../../../../components/profile';

class TopCommunitiesPure extends Component {
  state: {
    loading: string,
  };

  constructor() {
    super();

    this.state = { loading: '' };
  }

  toggleMembership = communityId => {
    this.setState({
      loading: communityId,
    });

    this.props
      .toggleCommunityMembership({ communityId })
      .then(({ data: { toggleCommunityMembership } }) => {
        this.setState({
          loading: '',
        });

        const isMember =
          toggleCommunityMembership.communityPermissions.isMember;

        track('community', isMember ? 'joined' : 'unjoined', null);
        track(
          'onboarding',
          isMember ? 'community joined' : 'community unjoined',
          null
        );

        this.props.joinedCommunity(isMember ? 1 : -1, false);
      })
      .catch(err => {
        this.setState({
          loading: '',
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { data: { topCommunities, error }, hasJoined } = this.props;
    const { loading } = this.state;
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
  toggleCommunityMembershipMutation,
  displayLoadingState,
  connect()
)(TopCommunitiesPure);
export default TopCommunities;
