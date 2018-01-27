//@flow
import * as React from 'react';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import { CommunityListItem } from '../../../components/listItems';
import Icon from '../../../components/icons';

import {
  StyledCard,
  ListHeading,
  ListHeader,
  ListContainer,
} from '../../../components/listItems/style';

type Props = {
  communities: Array<Object>,
  currentUser: Object,
  user: Object,
};

class CommunityList extends React.Component<Props> {
  render() {
    const { communities, user, currentUser } = this.props;

    if (!communities || communities.length === 0) {
      return null;
    }

    let sortedCommunities = communities;
    if (sortedCommunities[0].contextPermissions) {
      sortedCommunities = communities.slice().sort((a, b) => {
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

export default compose(withRouter, connect())(CommunityList);
