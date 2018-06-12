// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import searchUsersQuery, {
  type SearchUsersType,
} from '../../../shared/graphql/queries/search/searchUsers';
import viewNetworkHandler, {
  type ViewNetworkHandlerProps,
} from '../../components/ViewNetworkHandler';
import Loading from '../../components/Loading';
import { SearchView } from './style';
import { UserListItem } from '../../components/Lists';
import type { NavigationProps } from 'react-navigation';
import InfiniteList from '../../components/InfiniteList';
import { FullscreenNullState } from '../../components/NullStates';

type Props = {
  data: {
    search: SearchUsersType,
  },
  ...$Exact<ViewNetworkHandlerProps>,
  navigation: NavigationProps,
  queryString: ?string,
};

class UsersSearchView extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    const currProps = this.props;

    if (nextProps.data !== currProps.data) return true;
    if (nextProps.queryString !== currProps.queryString) return true;
    return false;
  }

  render() {
    const { isLoading, data, navigation, hasError } = this.props;

    if (data.search) {
      const { search: { searchResultsConnection } } = data;
      const hasResults =
        searchResultsConnection && searchResultsConnection.edges.length > 0;
      const results = hasResults
        ? searchResultsConnection.edges.map(e => e && e.node)
        : [];

      return (
        <SearchView>
          {!hasResults && (
            <FullscreenNullState
              title={'No results found'}
              subtitle={'Try searching for something else?'}
              icon={'person'}
            />
          )}
          {hasResults && (
            <InfiniteList
              data={results}
              renderItem={({ item }) => (
                <UserListItem
                  key={item.id}
                  user={item}
                  onPressHandler={() =>
                    navigation.navigate({
                      routeName: `User`,
                      key: item.id,
                      params: { id: item.id },
                    })
                  }
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

    if (hasError) {
      return <FullscreenNullState />;
    }

    return <SearchView />;
  }
}

export default compose(searchUsersQuery, viewNetworkHandler)(UsersSearchView);
