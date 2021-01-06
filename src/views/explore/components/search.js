// @flow
import * as React from 'react';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { debounce } from 'src/helpers/utils';
import { searchCommunitiesQuery } from 'shared/graphql/queries/search/searchCommunities';
import type { SearchCommunitiesType } from 'shared/graphql/queries/search/searchCommunities';
import { Spinner } from 'src/components/globals';
import { addToastWithTimeout } from 'src/actions/toasts';
import OutsideClickHandler from 'src/components/outsideClickHandler';
import { ESC, ENTER, ARROW_DOWN, ARROW_UP } from 'src/helpers/keycodes';
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
  focusedSearchResult: ?string,
  isFocused: boolean,
};

type Props = {
  client: Object,
  history: Object,
  dispatch: Dispatch<Object>,
};

class Search extends React.Component<Props, State> {
  input: React$Node;

  constructor() {
    super();

    this.state = {
      searchString: '',
      searchResults: [],
      searchIsLoading: false,
      focusedSearchResult: '',
      isFocused: true,
    };

    // only kick off search query if 500ms have passed without a consecutive invocation
    this.search = debounce(this.search, 500, false);
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
        query: searchCommunitiesQuery,
        variables: { queryString: searchString, type: 'COMMUNITIES' },
      })
      .then(
        ({ data: { search } }: { data: { search: SearchCommunitiesType } }) => {
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
            .map(c => c && c.node)
            .sort((a, b) => {
              if (!b) return 0;
              if (!a) return 0;
              return b.metaData.members - a.metaData.members;
            });

          return this.setState({
            searchResults: sorted,
            searchIsLoading: false,
            focusedSearchResult: sorted && sorted[0] ? sorted[0].id : null,
          });
        }
      )
      .catch(err =>
        this.props.dispatch(addToastWithTimeout('error', err.message))
      );
  };

  handleKeyPress = (e: any) => {
    // destructure the whole state object
    const { searchResults, focusedSearchResult } = this.state;

    const input = this.input;
    const searchResultIds =
      searchResults && searchResults.map(community => community.id);
    const indexOfFocusedSearchResult = searchResultIds.indexOf(
      focusedSearchResult
    );

    // if person presses escape
    if (e.keyCode === ESC) {
      this.setState({
        isFocused: false,
      });

      // $FlowFixMe
      input && input.focus();
      return;
    }

    if (e.keyCode === ENTER) {
      if (
        searchResults.length === 0 ||
        searchResults[indexOfFocusedSearchResult] === undefined
      )
        return;
      const slug = searchResults[indexOfFocusedSearchResult].slug;
      return this.props.history.push(`/${slug}`);
    }

    if (e.keyCode === ARROW_DOWN) {
      if (indexOfFocusedSearchResult === searchResults.length - 1) return;
      if (searchResults.length <= 1) return;

      const resultToFocus = searchResults[indexOfFocusedSearchResult + 1];
      if (!resultToFocus) return;

      return this.setState({
        focusedSearchResult: resultToFocus.id,
      });
    }

    if (e.keyCode === ARROW_UP) {
      if (indexOfFocusedSearchResult === 0) return;
      if (searchResults.length <= 1) return;

      const resultToFocus = searchResults[indexOfFocusedSearchResult - 1];
      if (!resultToFocus) return;

      return this.setState({
        focusedSearchResult: resultToFocus.id,
      });
    }
  };

  handleChange = (e: any) => {
    const string = e.target.value.toLowerCase().trim();

    if (e.target.value.length === 0) {
      this.setState({
        searchIsLoading: false,
        searchString: '',
      });
      return;
    }

    // set the searchstring to state
    this.setState({
      searchString: e.target.value,
      searchIsLoading: true,
    });

    // trigger a new search based on the search input
    // $FlowIssue
    this.search(string);
  };

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  onFocus = (e: any) => {
    const val = e.target.value;
    if (!val || val.length === 0) return;

    const string = val.toLowerCase().trim();

    // $FlowIssue
    this.search(string);

    return this.setState({
      isFocused: true,
    });
  };

  hideSearchResults = () => {
    return this.setState({
      isFocused: false,
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
            data-cy="explore-community-search-input"
            ref={c => {
              this.input = c;
            }}
            type="text"
            value={searchString}
            placeholder="Search..."
            onChange={this.handleChange}
            onFocus={this.onFocus}
          />
        </SearchInputWrapper>

        {// user has typed in a search string
        isFocused && searchString && (
          <OutsideClickHandler onOutsideClick={this.hideSearchResults}>
            <SearchResultsDropdown>
              {searchResults.length > 0 &&
                !searchIsLoading &&
                searchResults.map(community => {
                  return (
                    <SearchResult
                      focused={focusedSearchResult === community.id}
                      key={community.id}
                    >
                      <SearchLink to={`/${community.slug}`}>
                        <SearchResultImage
                          community={community}
                          showHoverProfile={false}
                        />
                        <SearchResultTextContainer>
                          <SearchResultMetaWrapper>
                            <SearchResultName>
                              {community.name}
                            </SearchResultName>
                            {community.metaData && (
                              <SearchResultMetadata>
                                {community.metaData.members.toLocaleString()}{' '}
                                members
                              </SearchResultMetadata>
                            )}
                          </SearchResultMetaWrapper>
                        </SearchResultTextContainer>
                      </SearchLink>
                    </SearchResult>
                  );
                })}

              {searchResults.length === 0 && !searchIsLoading && isFocused && (
                <SearchResult>
                  <SearchResultTextContainer>
                    <SearchResultNull>
                      <p>No communities found matching “{searchString}”</p>
                    </SearchResultNull>
                  </SearchResultTextContainer>
                </SearchResult>
              )}

              {searchIsLoading && isFocused && (
                <SearchResult>
                  <SearchResultTextContainer>
                    <SearchResultNull>
                      <p>Searching for “{searchString}”</p>
                    </SearchResultNull>
                  </SearchResultTextContainer>
                </SearchResult>
              )}
            </SearchResultsDropdown>
          </OutsideClickHandler>
        )}
      </SearchWrapper>
    );
  }
}

export default compose(
  connect(),
  withApollo,
  withRouter
)(Search);
