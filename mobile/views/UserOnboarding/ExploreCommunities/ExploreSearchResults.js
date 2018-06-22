// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import CommunityProfileCard from './CommunityProfileCard';
import {
  CommunityCardListScrollView,
  ExploreSectionHeader,
  ExploreSectionSubheader,
} from './style';
import ViewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../../components/ViewNetworkHandler';
import searchCommunities, {
  type SearchCommunitiesType,
} from '../../../../shared/graphql/queries/search/searchCommunities';
import ExploreContext from './context';
import { LoadingCard } from './CommunityProfileCard';

type Props = {
  ...$Exact<ViewNetworkHandlerProps>,
  queryString: string,
  data: {
    search: SearchCommunitiesType,
  },
};

class CommunityUpsellCards extends React.Component<Props> {
  render() {
    const { data, isLoading, queryString } = this.props;

    if (
      data.search &&
      data.search.searchResultsConnection &&
      data.search.searchResultsConnection.edges.length > 0
    ) {
      const communities = data.search.searchResultsConnection.edges
        .map(e => e && e.node)
        .sort((a, b) => {
          if (!b) return 0;
          if (!a) return 0;
          return b.metaData.members - a.metaData.members;
        });

      return (
        <React.Fragment>
          <ExploreSectionHeader>
            Communities about {queryString}
          </ExploreSectionHeader>
          <CommunityCardListScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {communities.map(
              community =>
                community && (
                  <ExploreContext.Consumer key={community.id}>
                    {ctx => (
                      <CommunityProfileCard {...ctx} community={community} />
                    )}
                  </ExploreContext.Consumer>
                )
            )}
          </CommunityCardListScrollView>
        </React.Fragment>
      );
    }

    if (isLoading) {
      return (
        <CommunityCardListScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
          <LoadingCard />
        </CommunityCardListScrollView>
      );
    }

    return (
      <React.Fragment>
        <ExploreSectionHeader>
          Nothing found for "{queryString}"
        </ExploreSectionHeader>
        <ExploreSectionSubheader>
          We couldn’t find any results for this search. Try searching for
          something else!
        </ExploreSectionSubheader>
      </React.Fragment>
    );
  }
}

export default compose(searchCommunities, ViewNetworkHandler)(
  CommunityUpsellCards
);
