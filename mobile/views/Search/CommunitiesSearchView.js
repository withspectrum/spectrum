// @flow
import React, { Component } from 'react';
import { Text } from 'react-native';
import { withNavigation } from 'react-navigation';
import compose from 'recompose/compose';
import searchCommunitiesQuery, {
  type SearchCommunitiesType,
} from '../../../shared/graphql/queries/search/searchCommunities';
import viewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../components/ViewNetworkHandler';
import Loading from '../../components/Loading';
import { SearchView } from './style';
import { CommunityListItem } from '../../components/Lists';
import type { Navigation } from '../../utils/types';
import InfiniteList from '../../components/InfiniteList';

type Props = {
  data: {
    search: SearchCommunitiesType,
  },
  ...$Exact<ViewNetworkHandlerProps>,
  navigation: Navigation,
};

class CommunitiesSearchView extends Component<Props> {
  render() {
    const { isLoading, data, navigation } = this.props;

    if (data.search) {
      const { search: { searchResultsConnection } } = data;
      const hasResults =
        searchResultsConnection && searchResultsConnection.edges.length > 0;
      const results = hasResults
        ? searchResultsConnection.edges.map(e => e && e.node)
        : [];

      return (
        <SearchView>
          {isLoading && <Loading />}
          {!hasResults && <Text>No results</Text>}
          {hasResults && (
            <InfiniteList
              data={results}
              renderItem={({ item }) => (
                <CommunityListItem
                  key={item.id}
                  community={item}
                  navigation={navigation}
                />
              )}
              loadingIndicator={<Loading />}
            />
          )}
        </SearchView>
      );
    }

    if (isLoading) {
      return (
        <SearchView>
          <Loading />
        </SearchView>
      );
    }

    return <SearchView />;
  }
}

export default compose(
  searchCommunitiesQuery,
  withNavigation,
  viewNetworkHandler
)(CommunitiesSearchView);
