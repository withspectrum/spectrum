// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
import { View, ListWrapper } from './style';
import {
  recentCommunitiesQuery,
  topCommunitiesQuery,
} from '../../api/community';
import { displayLoadingState, Loading } from '../../components/loading';
import Search from './components/search';
import CommunityList from './components/communityList';
import CommunityContainer from './containers/community';

class CommunitiesViewIndex extends Component {
  render() {
    const { top, recent, match } = this.props;
    const dataExists =
      top.networkStatus === 7 &&
      recent.networkStatus === 7 &&
      top.topCommunities &&
      recent.recentCommunities;

    if (top.loading || recent.loading) {
      return <Loading />;
    }

    if (top.error || recent.error) {
      return <div>Error</div>;
    }

    if (match.params.slug) {
      return (
        <View>
          <Search />
          <CommunityContainer slug={match.params.slug} />
        </View>
      );
    } else {
      return (
        <View>
          <Search />

          {dataExists &&
            <ListWrapper>
              <CommunityList data={top.topCommunities} label="Popular" />
              <CommunityList data={recent.recentCommunities} label="Recent" />
            </ListWrapper>}
        </View>
      );
    }
  }
}

export default compose(recentCommunitiesQuery, topCommunitiesQuery, pure)(
  CommunitiesViewIndex
);
