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
import InfiniteList from '../../components/InfiniteList';
import { FullscreenNullState } from '../../components/NullStates';

type Props = {
  data: {
    search: SearchUsersType,
  },
  ...$Exact<ViewNetworkHandlerProps>,
  onPress: (userId: string) => any,
  queryString: ?string,
  style: Object,
  keyboardShouldPersistTaps?: string,
};

class UsersSearchView extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    const currProps = this.props;

    if (nextProps.data !== currProps.data) return true;
    if (nextProps.queryString !== currProps.queryString) return true;
    return false;
  }

  render() {
    const {
      isLoading,
      data,
      hasError,
      onPress,
      keyboardShouldPersistTaps = 'never',
    } = this.props;

    if (data.search) {
      const { search: { searchResultsConnection } } = data;
      const hasResults =
        searchResultsConnection && searchResultsConnection.edges.length > 0;
      const results = hasResults
        ? searchResultsConnection.edges.map(e => e && e.node)
        : [];

      return (
        <SearchView style={this.props.style}>
          {!hasResults && <FullscreenNullState title={''} subtitle={''} />}
          {hasResults && (
            <InfiniteList
              data={results}
              keyboardShouldPersistTaps={keyboardShouldPersistTaps}
              renderItem={({ item }) => (
                <UserListItem
                  key={item.id}
                  user={item}
                  onPressHandler={() => onPress(item.id)}
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
        <SearchView style={this.props.style}>
          <Loading />
        </SearchView>
      );
    }

    if (hasError) {
      return <FullscreenNullState style={this.props.style} />;
    }

    return <SearchView style={this.props.style} />;
  }
}

export default compose(searchUsersQuery, viewNetworkHandler)(UsersSearchView);
