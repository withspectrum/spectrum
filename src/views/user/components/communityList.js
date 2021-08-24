//@flow
import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import { CommunityListItem } from 'src/components/entities';
import { ErrorBoundary } from 'src/components/error';
import { Loading } from 'src/components/loading';
import { PrimaryOutlineButton } from 'src/components/button';
import { getUserCommunityConnection } from 'shared/graphql/queries/user/getUserCommunityConnection';
import type { GetUserCommunityConnectionType } from 'shared/graphql/queries/user/getUserCommunityConnection';

type Props = {
  data: {
    user: GetUserCommunityConnectionType,
  },
  currentUser: Object,
  user: Object,
};

class CommunityList extends React.Component<Props> {
  render() {
    const { data } = this.props;

    if (data.loading) {
      return <Loading style={{ padding: '32px' }} />;
    }

    if (
      !data.user ||
      !data.user.communityConnection ||
      !data.user.communityConnection.edges ||
      data.user.communityConnection.edges.length === 0
    ) {
      return (
        <div style={{ padding: '16px' }}>
          <PrimaryOutlineButton style={{ flex: '1' }} to={'/explore'}>
            Explore communities
          </PrimaryOutlineButton>
        </div>
      );
    }

    const communities = data.user.communityConnection.edges.map(
      c => c && c.node
    );

    let sortedCommunities = communities;

    if (sortedCommunities[0] && sortedCommunities[0].contextPermissions) {
      sortedCommunities = communities.slice();
    }

    return (
      <div>
        {sortedCommunities.map(community => {
          if (!community) return null;
          return (
            <ErrorBoundary key={community.id}>
              <CommunityListItem
                communityObject={community}
                profilePhoto={community.profilePhoto}
                name={community.name}
              />
            </ErrorBoundary>
          );
        })}
      </div>
    );
  }
}

export default compose(
  withRouter,
  getUserCommunityConnection,
  connect()
)(CommunityList);
