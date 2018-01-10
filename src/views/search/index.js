import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Titlebar from '../titlebar';
import { View } from './style';
import { searchThreadsQuery } from '../../api/thread';
import DashboardThreadFeed from '../dashboard/components/threadFeed';
import { InboxScroller } from '../dashboard/style';
import SearchInput from './searchInput';

const SearchThreadFeed = compose(connect(), searchThreadsQuery)(
  DashboardThreadFeed
);

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
        <Titlebar
          provideBack
          noComposer
          title={'Search'}
          style={{ gridArea: 'header' }}
        />

        <SearchInput handleSubmit={this.handleSubmit} />

        <InboxScroller id="scroller-for-inbox">
          {searchQueryString &&
            searchQueryString.length > 0 &&
            searchFilter && (
              <SearchThreadFeed
                queryString={searchQueryString}
                filter={searchFilter}
              />
            )}
        </InboxScroller>
      </View>
    );
  }
}

export default compose(connect())(Search);
