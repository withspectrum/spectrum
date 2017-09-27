import React, { Component } from 'react';
import { findDOMNode } from 'react-dom';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withApollo } from 'react-apollo';
// $FlowFixMe
import { withRouter } from 'react-router';
import { Spinner } from '../../../../components/globals';
import { throttle } from '../../../../helpers/utils';
import { SEARCH_COMMUNITIES_QUERY } from '../../../../api/community';
import {
  ComposerInputWrapper,
  SearchSpinnerContainer,
  ComposerInput,
  SearchResultsDropdown,
  SearchResult,
  SearchResultNull,
  SearchResultUsername,
  SearchResultDisplayName,
  SearchResultTextContainer,
  SearchResultImage,
} from './style';

class Search extends Component {
  state: {
    searchString: string,
    searchResults: Array<any>,
    searchIsLoading: boolean,
    focusedSearchResult: string,
  };

  constructor(props) {
    super(props);

    this.state = {
      searchString: '',
      searchResults: [],
      searchIsLoading: false,
      focusedSearchResult: '',
    };

    // only kick off search query every 200ms
    this.search = throttle(this.search, 200);
  }

  search = (string: string) => {
    const { client } = this.props;

    this.setState({
      searchIsLoading: true,
    });

    client
      .query({
        query: SEARCH_COMMUNITIES_QUERY,
        variables: {
          string,
        },
      })
      .then(({ data: { searchCommunities } }) => {
        if (searchCommunities.length > 0) {
          this.setState({
            searchResults:
              searchCommunities.length > 0 ? searchCommunities : [],
            searchIsLoading: false,
            focusedSearchResult:
              searchCommunities.length > 0 ? searchCommunities[0].id : '',
          });
        } else {
          this.setState({
            searchResults: [],
            searchIsLoading: false,
            focusedSearchResult: '',
          });
        }
      });
  };

  handleKeyPress = (e: any) => {
    const { searchString, searchResults, focusedSearchResult } = this.state;

    // create a reference to the input - we will use this to call .focus()
    // after certain events (like pressing backspace or enter)
    const input = findDOMNode(this.refs.input);

    // create temporary arrays of IDs from the searchResults and selectedUsers
    // to more easily manipulate the ids
    const searchResultIds = searchResults && searchResults.map(user => user.id);

    const indexOfFocusedSearchResult = searchResultIds.indexOf(
      focusedSearchResult
    );

    // if person presses esc, clear all results, stop loading
    if (e.keyCode === 27) {
      this.setState({
        searchResults: [],
        searchIsLoading: false,
      });

      return;
    }

    // backspace
    if (e.keyCode === 8) {
      if (searchString.length > 0) return;
      return input.focus();
    }

    //escape
    if (e.keyCode === 27) {
      this.setState({
        searchResults: [],
        searchIsLoading: false,
      });

      return input.focus();
    }

    // down
    if (e.keyCode === 40) {
      if (indexOfFocusedSearchResult === searchResults.length - 1) return;
      if (searchResults.length === 1) return;

      // 2
      this.setState({
        focusedSearchResult: searchResults[indexOfFocusedSearchResult + 1].id,
      });

      return;
    }

    // up
    if (e.keyCode === 38) {
      // 1
      if (indexOfFocusedSearchResult === 0) return;
      if (searchResults.length === 1) return;

      // 2
      this.setState({
        focusedSearchResult: searchResults[indexOfFocusedSearchResult - 1].id,
      });

      return;
    }

    // enter
    if (e.keyCode === 13) {
      if (!searchResults[indexOfFocusedSearchResult]) return;
      return this.goToCommunity(searchResults[indexOfFocusedSearchResult].slug);
    }
  };

  goToCommunity = slug => {
    const { history } = this.props;
    this.setState({
      searchResults: [],
      searchIsLoading: false,
      focusedSearchResult: '',
      searchString: '',
    });
    return history.push(`/communities/${slug}`);
  };

  handleChange = (e: any) => {
    const string = e.target.value.toLowerCase().trim();

    this.setState({
      searchString: e.target.value,
    });

    this.search(string);
  };

  componentWillMount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  render() {
    const {
      searchString,
      searchIsLoading,
      searchResults,
      focusedSearchResult,
    } = this.state;

    return (
      <ComposerInputWrapper>
        {searchIsLoading &&
          <SearchSpinnerContainer>
            <Spinner size={16} color={'brand.default'} />
          </SearchSpinnerContainer>}

        <ComposerInput
          ref="input"
          type="text"
          value={searchString}
          placeholder="Search for communities..."
          onChange={this.handleChange}
          autoFocus={true}
        />

        {// user has typed in a search string
        searchString &&
          //if there are selected users already, we manually shift
          // the search results position down
          <SearchResultsDropdown>
            {searchResults.length > 0 &&
              searchResults.map(community => {
                return (
                  <SearchResult
                    focused={focusedSearchResult === community.id}
                    key={community.id}
                    onClick={() => this.goToCommunity(community.slug)}
                  >
                    <SearchResultImage
                      isOnline={community.isOnline}
                      size={32}
                      radius={8}
                      src={community.profilePhoto}
                    />
                    <SearchResultTextContainer>
                      <SearchResultDisplayName>
                        {community.name}
                      </SearchResultDisplayName>
                      {community.metaData &&
                        <SearchResultUsername>
                          {community.metaData.members} members
                        </SearchResultUsername>}
                    </SearchResultTextContainer>
                  </SearchResult>
                );
              })}

            {searchResults.length === 0 &&
              <SearchResult>
                <SearchResultTextContainer>
                  <SearchResultNull>
                    No communities found matching "{searchString}"
                  </SearchResultNull>
                </SearchResultTextContainer>
              </SearchResult>}
          </SearchResultsDropdown>}
      </ComposerInputWrapper>
    );
  }
}

export default compose(withApollo, withRouter, connect(), pure)(Search);
