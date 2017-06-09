// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { Link } from 'react-router-dom';
// $FlowFixMe
import pure from 'recompose/pure';
import { getTopCommunities } from '../queries';
import { CommunityListItem } from '../../../components/listItems';
import { displayLoadingState } from '../../../components/loading';
import Icon from '../../../components/icons';
import { ListContainer } from '../../../components/listItems/style';
import { ListCard } from '../style';

class CommunityList extends Component {
  render() {
    const {
      data: { topCommunities, error },
      withDescription,
      withMeta,
    } = this.props;

    const sorted = topCommunities.slice().sort((a, b) => {
      return b.metaData.members - a.metaData.members;
    });

    if (!error && topCommunities.length > 0) {
      return (
        <ListCard>
          <ListContainer>
            {sorted.map(community => {
              return (
                <Link key={community.id} to={`/${community.slug}`}>
                  <CommunityListItem
                    contents={community}
                    withDescription={withDescription}
                    withMeta={withMeta}
                    meta={`${community.metaData.members > 1 ? `${community.metaData.members} members` : `${community.metaData.members} member`}`}
                  >
                    <Icon glyph="view-forward" />
                  </CommunityListItem>
                </Link>
              );
            })}
          </ListContainer>
        </ListCard>
      );
    }
  }
}

const TopCommunityList = compose(getTopCommunities, displayLoadingState, pure)(
  CommunityList
);
const mapStateToProps = state => ({ currentUser: state.users.currentUser });
export default connect(mapStateToProps)(TopCommunityList);
