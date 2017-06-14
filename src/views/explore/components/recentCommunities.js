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
import { timeDifference } from '../../../helpers/utils';
import { getRecentCommunities } from '../queries';
import { CommunityListItem } from '../../../components/listItems';
import { displayLoadingState } from '../../../components/loading';
import Icon from '../../../components/icons';
import { ListContainer } from '../../../components/listItems/style';
import { ListCard } from '../style';

class CommunityList extends Component {
  render() {
    const {
      data: { recentCommunities, error },
      withDescription,
      withMeta,
    } = this.props;
    let now = Date.now();

    if (!error && recentCommunities.length > 0) {
      return (
        <ListCard>
          <ListContainer>
            {recentCommunities.map(community => {
              return (
                <Link key={community.id} to={`/${community.slug}`}>
                  <CommunityListItem
                    contents={community}
                    withDescription={withDescription}
                    withMeta={withMeta}
                    meta={timeDifference(now, Date.parse(community.createdAt))}
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

const RecentCommunityList = compose(
  getRecentCommunities,
  displayLoadingState,
  pure
)(CommunityList);
const mapStateToProps = state => ({ currentUser: state.users.currentUser });
export default connect(mapStateToProps)(RecentCommunityList);
