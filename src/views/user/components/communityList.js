//@flow
import * as React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import { withRouter } from 'react-router';
//$FlowFixMe
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

    const sortedCommunities = communities.slice().sort((a, b) => {
      const bc = parseInt(b.communityPermissions.reputation, 10);
      const ac = parseInt(a.communityPermissions.reputation, 10);
      return bc <= ac ? -1 : 1;
    });

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
                <CommunityListItem community={community} showDescription>
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
