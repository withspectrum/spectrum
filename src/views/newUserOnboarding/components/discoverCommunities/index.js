// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { getCommunitiesByCuratedContentType } from 'shared/graphql/queries/community/getCommunities';
import type { GetCommunitiesType } from 'shared/graphql/queries/community/getCommunities';
import { displayLoadingState } from '../../../../components/loading';
import { Row } from './style';
import { CommunityProfile } from '../../../../components/profile';
import { track, events } from 'src/helpers/analytics';

type Props = {
  data: {
    communities: GetCommunitiesType,
    error: ?string,
  },
  hasJoined: number,
  joinedCommunity: Function,
};

class TopCommunitiesPure extends React.Component<Props> {
  componentDidMount() {
    track(events.USER_ONBOARDING_JOIN_COMMUNITIES_STEP_VIEWED);
  }

  render() {
    const {
      data: { communities, error },
      hasJoined,
      joinedCommunity,
    } = this.props;
    // don't display communities where the user is blocked
    const filteredCommunities = communities.filter(
      community => community && !community.communityPermissions.isBlocked
    );

    if (!error && filteredCommunities.length > 0) {
      return (
        <Row hasJoined={hasJoined > 0}>
          {filteredCommunities.map(community => {
            if (!community) return null;
            return (
              <CommunityProfile
                profileSize={'upsell'}
                data={{ community }}
                key={community.id}
                joinedCommunity={joinedCommunity}
                showHoverProfile={false}
              />
            );
          })}
        </Row>
      );
    }

    return null;
  }
}

const TopCommunities = compose(
  getCommunitiesByCuratedContentType,
  displayLoadingState,
  connect()
)(TopCommunitiesPure);
export default TopCommunities;
