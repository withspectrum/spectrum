// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
import { View } from './style';
import { communitiesQuery } from '../../api/queries';
import { displayLoadingState } from '../../components/loading';
import Chart from '../../components/spark-line';
import getGrowthPerDay from '../../utils/get-growth-per-day';
import Search from './components/search';
import CommunityContainer from './containers/community';

class CommunitiesViewIndex extends Component {
  render() {
    const { data: { error, meta }, match } = this.props;
    if (!meta || error) {
      return <div />;
    }

    const communityGrowth = getGrowthPerDay(meta.communityGrowth);

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
          <Chart height={128} data={communityGrowth} />
        </View>
      );
    }
  }
}

export default compose(communitiesQuery, displayLoadingState, pure)(
  CommunitiesViewIndex
);
