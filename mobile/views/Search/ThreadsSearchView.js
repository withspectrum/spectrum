// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import searchThreadsQuery from '../../../shared/graphql/queries/search/searchThreads';
import { SearchView } from './style';
import ThreadFeed from '../../components/ThreadFeed';
import type { NavigationProps } from 'react-navigation';
import { FullscreenNullState } from '../../components/NullStates';

type Props = {
  queryString: string,
  navigation: NavigationProps,
};

const SearchThreadFeed = compose(searchThreadsQuery)(ThreadFeed);

class ThreadsSearchView extends Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    const currProps = this.props;
    if (nextProps.queryString !== currProps.queryString) return true;
    return false;
  }

  render() {
    const { queryString, navigation } = this.props;
    return (
      <SearchView>
        <SearchThreadFeed
          navigation={navigation}
          queryString={queryString}
          noThreadsFallback={() => (
            <FullscreenNullState
              title={'No results found'}
              subtitle={'Try searching for something else?'}
              icon={'thread'}
            />
          )}
        />
      </SearchView>
    );
  }
}

export default ThreadsSearchView;
