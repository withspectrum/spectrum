// @flow
import React, { Component } from 'react';
import compose from 'recompose/compose';
import searchThreadsQuery from '../../../shared/graphql/queries/search/searchThreads';
import { SearchView } from './style';
import ThreadFeed from '../../components/ThreadFeed';
import type { NavigationProps } from 'react-navigation';

type Props = {
  queryString: string,
  navigation: NavigationProps,
};

const SearchThreadFeed = compose(searchThreadsQuery)(ThreadFeed);

class ThreadsSearchView extends Component<Props> {
  render() {
    const { queryString, navigation } = this.props;
    return (
      <SearchView>
        <SearchThreadFeed navigation={navigation} queryString={queryString} />
      </SearchView>
    );
  }
}

export default ThreadsSearchView;
