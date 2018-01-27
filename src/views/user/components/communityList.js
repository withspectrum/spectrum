//@flow
import * as React from 'react';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import { CommunityListItem } from '../../../components/listItems';
import Icon from '../../../components/icons';
import { getUserCommunityConnection } from 'shared/graphql/queries/user/getUserCommunityConnection';
import type { GetUserCommunityConnectionType } from 'shared/graphql/queries/user/getUserCommunityConnection';

import {
  StyledCard,
  ListHeading,
  ListHeader,
  ListContainer,
} from '../../../components/listItems/style';

type Props = {
  data: {
    user: GetUserCommunityConnectionType,
  },
  currentUser: Object,
  user: Object,
};

class CommunityList extends React.Component<Props> {
  render() {
    const { data, user, currentUser } = this.props;

    if (
      !data.user ||
      !data.user.communityConnection ||
      !data.user.communityConnection.edges ||
      data.user.communityConnection.edges.length === 0
    ) {
      return null;
    }

    const communities = data.user.communityConnection.edges.map(
      c => c && c.node
    );

    let sortedCommunities = communities;

    if (sortedCommunities[0] && sortedCommunities[0].contextPermissions) {
      sortedCommunities = communities.slice().sort((a, b) => {
        if (!a || !b) return 0;

        const bc = parseInt(b.contextPermissions.reputation, 10);
        const ac = parseInt(a.contextPermissions.reputation, 10);
        return bc <= ac ? -1 : 1;
      });
    }

    return (
      <StyledCard largeOnly>
        <ListHeader>
          {user === currentUser ? (
            <ListHeading>My Communities</ListHeading>
          ) : (
            <ListHeading>Member of</ListHeading>
          )}
        </ListHeader>
        <ListContainer>
          {sortedCommunities.map(community => {
            if (!community) return null;
            return (
              <Link key={community.id} to={`/${community.slug}`}>
                <CommunityListItem
                  community={community}
                  reputation={
                    community.contextPermissions
                      ? community.contextPermissions.reputation
                      : null
                  }
                  showDescription
                >
                  <Icon glyph="view-forward" />
                </CommunityListItem>
              </Link>
            );
          })}
        </ListContainer>
      </StyledCard>
    );
  }
}

export default compose(withRouter, getUserCommunityConnection, connect())(
  CommunityList
);
