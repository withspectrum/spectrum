// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import searchThreadsQuery from '../../../shared/graphql/queries/search/searchThreads';
import { SearchView } from './style';
import ThreadFeed from '../../components/ThreadFeed';

type Props = {
  queryString: string,
};

const SearchThreadFeed = compose(searchThreadsQuery)(ThreadFeed);

class ThreadsSearchView extends React.Component<Props> {
  render() {
    const { queryString } = this.props;
    return (
      <SearchView>
        <SearchThreadFeed queryString={queryString} />
      </SearchView>
    );
  }
}

export default ThreadsSearchView;
