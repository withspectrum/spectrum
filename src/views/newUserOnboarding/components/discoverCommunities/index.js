// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { getCommunitiesByCuratedContentType } from 'shared/graphql/queries/community/getCommunities';
import { displayLoadingState } from '../../../../components/loading';
import { Row } from './style';
import { CommunityProfile } from '../../../../components/profile';

type Props = {
  data: {
    communities: any,
    error: ?string,
  },
  hasJoined: number,
  joinedCommunity: Function,
};

class TopCommunitiesPure extends React.Component<Props> {
  render() {
    const {
      data: { communities, error },
      hasJoined,
      joinedCommunity,
    } = this.props;
    // don't display communities where the user is blocked
    const filteredCommunities = communities.filter(
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
                joinedCommunity={joinedCommunity}
              />
            );
          })}
        </Row>
      );
    }
  }
}

const TopCommunities = compose(
  getCommunitiesByCuratedContentType,
  displayLoadingState,
  connect()
)(TopCommunitiesPure);
export default TopCommunities;
