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

import { ListContainer } from '../../../components/listItems/style';

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

    if (sortedCommunities[0] && sortedCommunities[0].communityPermissions) {
      sortedCommunities = communities.slice().sort((a, b) => {
        if (!a || !b) return 0;

        const bc = parseInt(b.communityPermissions.reputation, 10);
        const ac = parseInt(a.communityPermissions.reputation, 10);
        return bc <= ac ? -1 : 1;
      });
    }

    return (
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
                    : community.communityPermissions
                      ? community.communityPermissions.reputation
                      : null
                }
              >
                <Icon glyph="view-forward" />
              </CommunityListItem>
            </Link>
          );
        })}
      </ListContainer>
    );
  }
}

export default compose(withRouter, getUserCommunityConnection, connect())(
  CommunityList
);
