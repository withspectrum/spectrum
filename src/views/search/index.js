// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { View } from './style';
import searchThreadsQuery from 'shared/graphql/queries/search/searchThreads';
import ThreadFeed from 'src/components/threadFeed';
import SearchInput from './searchInput';

const SearchThreadFeed = compose(
  connect(),
  searchThreadsQuery
)(ThreadFeed);

type Props = {};
type State = {
  searchQueryString: ?string,
};
class Search extends React.Component<Props, State> {
  state = { searchQueryString: '' };

  handleSubmit = (searchQueryString: string) => {
    if (searchQueryString.length > 0) {
      this.setState({ searchQueryString });
    }
  };

  render() {
    const { searchQueryString } = this.state;
    const searchFilter = { everythingFeed: true };

    return (
      <View>
        <SearchInput handleSubmit={this.handleSubmit} />

        {searchQueryString && searchQueryString.length > 0 && searchFilter && (
          <SearchThreadFeed
            queryString={searchQueryString}
            filter={searchFilter}
          />
        )}
      </View>
    );
  }
}

export default compose(connect())(Search);
