// @flow
import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import { withApollo } from 'react-apollo';
import { throttle } from '../../../helpers/utils';
import { searchCommunityThreadsQuery } from '../../../api/community';
import ThreadFeed from '../../../components/threadFeed';
import { SearchContainer, SearchInput } from '../style';

const SearchThreadFeed = compose(searchCommunityThreadsQuery)(ThreadFeed);

class Search extends Component {
  state: {
    searchString: string,
    sendStringToServer: string,
  };

  constructor() {
    super();

    this.state = {
      searchString: '',
      sendStringToServer: '',
    };

    this.search = throttle(this.search, 500);
  }

  handleChange = (e: any) => {
    const searchString = e.target.value.toLowerCase().trim();

    // set the searchstring to state
    this.setState({
      searchString,
    });

    // trigger a new search based on the search input
    this.search(searchString);
  };

  search = (searchString: string) => {
    const { community } = this.props;

    // don't start searching until at least 3 characters are typed
    if (searchString.length < 3) return;

    // start the input loading spinner
    this.setState({
      sendStringToServer: searchString,
    });
  };

  render() {
    const { community } = this.props;
    const { searchString, sendStringToServer } = this.state;

    return (
      <div>
        <SearchContainer>
          <SearchInput
            defaultValue={searchString}
            autoFocus={true}
            type="text"
            placeholder={`Search in ${community.name}...`}
            onChange={this.handleChange}
          />
        </SearchContainer>
        {searchString &&
          sendStringToServer &&
          <SearchThreadFeed
            viewContext="community"
            communityId={community.id}
            searchString={sendStringToServer}
            community={community}
            pinnedThreadId={community.pinnedThreadId}
          />}
      </div>
    );
  }
}

export default compose(pure)(Search);
