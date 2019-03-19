// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { ViewGrid } from 'src/components/layout';
import searchThreadsQuery from 'shared/graphql/queries/search/searchThreads';
import ThreadFeed from 'src/components/threadFeed';
import SearchInput from './searchInput';
import { setTitlebarProps } from 'src/actions/titlebar';

const SearchThreadFeed = compose(
  connect(),
  searchThreadsQuery
)(ThreadFeed);

type Props = {
  dispatch: Function,
};
type State = {
  searchQueryString: ?string,
};
class Search extends React.Component<Props, State> {
  state = { searchQueryString: '' };

  componentDidMount() {
    const { dispatch } = this.props;
    return dispatch(
      setTitlebarProps({
        title: 'Search',
      })
    );
  }

  handleSubmit = (searchQueryString: string) => {
    if (searchQueryString.length > 0) {
      this.setState({ searchQueryString });
    }
  };

  render() {
    const { searchQueryString } = this.state;
    const searchFilter = { everythingFeed: true };

    return (
      <ViewGrid>
        <SearchInput handleSubmit={this.handleSubmit} />

        {searchQueryString && searchQueryString.length > 0 && searchFilter && (
          <SearchThreadFeed
            queryString={searchQueryString}
            filter={searchFilter}
          />
        )}
      </ViewGrid>
    );
  }
}

export default compose(connect())(Search);
