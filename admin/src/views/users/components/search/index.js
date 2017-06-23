// @flow
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
import { SEARCH_USERS_QUERY } from '../../../../api/queries';
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
        query: SEARCH_USERS_QUERY,
        variables: {
          string,
        },
      })
      .then(({ data: { searchUsers } }) => {
        if (searchUsers.length > 0) {
          this.setState({
            searchResults: searchUsers.length > 0 ? searchUsers : [],
            searchIsLoading: false,
            focusedSearchResult: searchUsers.length > 0
              ? searchUsers[0].id
              : '',
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
      return this.goToUser(searchResults[indexOfFocusedSearchResult].username);
    }
  };

  goToUser = username => {
    const { history } = this.props;
    this.setState({
      searchResults: [],
      searchIsLoading: false,
      focusedSearchResult: '',
      searchString: '',
    });
    return history.push(`/users/${username}`);
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
          placeholder="Search for people..."
          onChange={this.handleChange}
          autoFocus={true}
        />

        {// user has typed in a search string
        searchString &&
          //if there are selected users already, we manually shift
          // the search results position down
          <SearchResultsDropdown>

            {searchResults.length > 0 &&
              searchResults.map(user => {
                return (
                  <SearchResult
                    focused={focusedSearchResult === user.id}
                    key={user.id}
                    onClick={() => this.goToUser(user.username)}
                  >
                    <SearchResultImage
                      isOnline={user.isOnline}
                      size={32}
                      radius={32}
                      src={user.profilePhoto}
                    />
                    <SearchResultTextContainer>
                      <SearchResultDisplayName>
                        {user.name}
                      </SearchResultDisplayName>
                      {user.username &&
                        <SearchResultUsername>
                          @{user.username}
                        </SearchResultUsername>}
                    </SearchResultTextContainer>
                  </SearchResult>
                );
              })}

            {searchResults.length === 0 &&
              <SearchResult>
                <SearchResultTextContainer>
                  <SearchResultNull>
                    No users found matching "{searchString}"
                  </SearchResultNull>
                </SearchResultTextContainer>
              </SearchResult>}
          </SearchResultsDropdown>}
      </ComposerInputWrapper>
    );
  }
}

export default compose(withApollo, withRouter, connect(), pure)(Search);
