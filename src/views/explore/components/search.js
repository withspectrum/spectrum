// @flow
import * as React from 'react';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import Link from 'src/components/link';
import { Button } from '../../../components/buttons';
import { findDOMNode } from 'react-dom';
import { throttle } from '../../../helpers/utils';
import { SEARCH_COMMUNITIES_QUERY } from '../../../api/search/searchCommunities';
import { Spinner } from '../../../components/globals';
import {
  SearchWrapper,
  SearchInput,
  SearchInputWrapper,
  SearchSpinnerContainer,
  SearchResultsDropdown,
  SearchResult,
  SearchResultTextContainer,
  SearchResultNull,
  SearchResultImage,
  SearchResultMetaWrapper,
  SearchResultName,
  SearchResultMetadata,
  SearchLink,
  SearchIcon,
} from '../style';

type State = {
  searchString: string,
  searchResults: Array<any>,
  searchIsLoading: boolean,
  focusedSearchResult: string,
  isFocused: boolean,
};

type Props = {
  client: Object,
  history: Object,
};

class Search extends React.Component<Props, State> {
  constructor() {
    super();

    this.state = {
      searchString: '',
      searchResults: [],
      searchIsLoading: false,
      focusedSearchResult: '',
      isFocused: true,
    };

    // only kick off search query every 200ms
    this.search = throttle(this.search, 500);
  }

  search = (searchString: string) => {
    const { client } = this.props;
    if (!searchString || searchString.length === 0) return;

    // start the input loading spinner
    this.setState({
      searchIsLoading: true,
    });

    // trigger the query
    client
      .query({
        query: SEARCH_COMMUNITIES_QUERY,
        variables: { queryString: searchString, type: 'COMMUNITIES' },
      })
      .then(({ data: { search }, data }) => {
        if (
          !search ||
          !search.searchResultsConnection ||
          search.searchResultsConnection.edges.length === 0
        ) {
          return this.setState({
            searchResults: [],
            searchIsLoading: false,
            focusedSearchResult: '',
          });
        }

        const searchResults = search.searchResultsConnection.edges;

        const sorted = searchResults
          .slice()
          .map(c => c.node)
          .sort((a, b) => {
            return b.metaData.members - a.metaData.members;
          });

        return this.setState({
          searchResults: sorted,
          searchIsLoading: false,
          focusedSearchResult: sorted[0].id,
        });
      });
  };

  handleKeyPress = (e: any) => {
    // destructure the whole state object
    const { searchResults, focusedSearchResult } = this.state;

    const input = findDOMNode(this.refs.input);
    const searchResultIds =
      searchResults && searchResults.map(community => community.id);
    const indexOfFocusedSearchResult = searchResultIds.indexOf(
      focusedSearchResult
    );

    // if person presses escape
    if (e.keyCode === 27) {
      this.setState({
        searchResults: [],
        searchIsLoading: false,
        searchString: '',
      });

      // $FlowFixMe
      input && input.focus();
      return;
    }

    // if user presses enter
    if (e.keyCode === 13) {
      if (
        searchResults.length === 0 ||
        searchResults[indexOfFocusedSearchResult] === undefined
      )
        return;
      const slug = searchResults[indexOfFocusedSearchResult].slug;
      return this.props.history.push(`/${slug}`);
    }

    // if person presses down
    if (e.keyCode === 40) {
      if (indexOfFocusedSearchResult === searchResults.length - 1) return;
      if (searchResults.length <= 1) return;

      return this.setState({
        focusedSearchResult: searchResults[indexOfFocusedSearchResult + 1].id,
      });
    }

    // if person presses up
    if (e.keyCode === 38) {
      if (indexOfFocusedSearchResult === 0) return;
      if (searchResults.length <= 1) return;

      return this.setState({
        focusedSearchResult: searchResults[indexOfFocusedSearchResult - 1].id,
      });
    }
  };

  handleChange = (e: any) => {
    const string = e.target.value.toLowerCase().trim();

    if (e.target.value.length === 0) {
      this.setState({
        searchIsLoading: false,
      });
    }

    // set the searchstring to state
    this.setState({
      searchString: e.target.value,
    });

    // trigger a new search based on the search input
    this.search(string);
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  onFocus = (e: any) => {
    const val = e.target.val;
    if (!val || val.length === 0) return;

    const string = val.toLowerCase().trim();
    this.search(string);

    return this.setState({
      isFocused: true,
    });
  };

  render() {
    const {
      searchString,
      searchIsLoading,
      searchResults,
      focusedSearchResult,
      isFocused,
    } = this.state;

    return (
      <SearchWrapper>
        {searchIsLoading && (
          <SearchSpinnerContainer>
            <Spinner size={16} color={'brand.default'} />
          </SearchSpinnerContainer>
        )}
        <SearchInputWrapper>
          <SearchIcon glyph="search" onClick={this.onFocus} />
          <SearchInput
            ref="input"
            type="text"
            value={searchString}
            placeholder="Search for communities or topics..."
            onChange={this.handleChange}
            onFocus={this.onFocus}
          />
        </SearchInputWrapper>

        {// user has typed in a search string
        searchString && (
          <SearchResultsDropdown>
            {searchResults.length > 0 &&
              searchResults.map(community => {
                return (
                  <SearchResult
                    focused={focusedSearchResult === community.id}
                    key={community.id}
                  >
                    <SearchLink to={`/${community.slug}`}>
                      <SearchResultImage
                        community={community}
                        src={community.profilePhoto}
                      />
                      <SearchResultTextContainer>
                        <SearchResultMetaWrapper>
                          <SearchResultName>{community.name}</SearchResultName>
                          {community.metaData && (
                            <SearchResultMetadata>
                              {community.metaData.members} members
                            </SearchResultMetadata>
                          )}
                        </SearchResultMetaWrapper>
                      </SearchResultTextContainer>
                    </SearchLink>
                  </SearchResult>
                );
              })}

            {searchResults.length === 0 &&
              isFocused && (
                <SearchResult>
                  <SearchResultTextContainer>
                    <SearchResultNull>
                      <p>No communities found matching "{searchString}"</p>
                      <Link to={'/new/community'}>
                        <Button>Create a Community</Button>
                      </Link>
                    </SearchResultNull>
                  </SearchResultTextContainer>
                </SearchResult>
              )}
          </SearchResultsDropdown>
        )}
      </SearchWrapper>
    );
  }
}

export default compose(withApollo, withRouter)(Search);
