// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { throttle } from 'src/helpers/utils';
import searchThreads from 'shared/graphql/queries/search/searchThreads';
import ThreadFeed from 'src/components/threadFeed';
import { SearchContainer, SearchInput } from '../style';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';

const SearchThreadFeed = compose(searchThreads)(ThreadFeed);

type Props = {
  channel: GetChannelType,
};

type State = {
  searchString: string,
  sendStringToServer: string,
};

class Search extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      searchString: '',
      sendStringToServer: '',
    };

    this.search = throttle(this.search, 500);
  }

  search = searchString => {
    // don't start searching until at least 3 characters are typed
    if (searchString.length < 3) return;

    // start the input loading spinner
    this.setState({
      sendStringToServer: searchString,
    });
  };

  handleChange = (e: any) => {
    const searchString = e.target.value.toLowerCase().trim();

    // set the searchstring to state
    this.setState({
      searchString,
    });

    // trigger a new search based on the search input
    // $FlowIssue
    this.search(searchString);
  };

  render() {
    const { channel } = this.props;
    const { searchString, sendStringToServer } = this.state;

    return (
      <div>
        <SearchContainer>
          <SearchInput
            defaultValue={searchString}
            autoFocus={true}
            type="text"
            placeholder={`Search all threads in ${channel.name}...`}
            onChange={this.handleChange}
            data-cy="channel-search-input"
          />
        </SearchContainer>
        {searchString && sendStringToServer && (
          <SearchThreadFeed
            search
            viewContext="channelProfile"
            channelId={channel.id}
            queryString={sendStringToServer}
            filter={{ channelId: channel.id }}
            channel={channel}
          />
        )}
      </div>
    );
  }
}

export default compose()(Search);
