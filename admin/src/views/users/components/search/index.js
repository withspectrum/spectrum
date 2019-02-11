// @flow
import * as React from 'react';
import { findDOMNode } from 'react-dom';
import compose from 'recompose/compose';
import pure from 'recompose/pure';
import { connect } from 'react-redux';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router';
import {
  ESC,
  BACKSPACE,
  ENTER,
  ARROW_DOWN,
  ARROW_UP,
} from 'src/helpers/keycodes';
import { Spinner } from '../../../../components/globals';
import { throttle } from '../../../../helpers/utils';
import { searchUsersQuery } from 'shared/graphql/queries/search/searchUsers';
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

type State = {
  searchString: string,
  searchResults: Array<any>,
  searchIsLoading: boolean,
  focusedSearchResult: string,
};

type Props = {
  client: Object,
  history: Object,
};

class Search extends React.Component<Props, State> {
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

  search = (queryString: string) => {
    const { client } = this.props;

    this.setState({
      searchIsLoading: true,
    });

    client
      .query({
        query: searchUsersQuery,
        variables: {
          queryString,
          type: 'USERS',
        },
      })
      .then(({ data: { search } }) => {
        const hasSearchResults =
          search &&
          search.searchResultsConnection &&
          search.searchResultsConnection.edges.length > 0;
        if (!hasSearchResults) {
          return this.setState({
            searchResults: [],
            searchIsLoading: false,
            focusedSearchResult: '',
          });
        }

        const searchResults = search.searchResultsConnection.edges.map(
          e => e.node
        );

        return this.setState({
          searchResults: searchResults,
          searchIsLoading: false,
          focusedSearchResult: searchResults[0],
        });
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

    if (e.keyCode === ESC) {
      this.setState({
        searchResults: [],
        searchIsLoading: false,
      });

      return;
    }

    if (e.keyCode === BACKSPACE) {
      if (searchString.length > 0) return;
      // $FlowFixMe
      return input && input.focus();
    }

    if (e.keyCode === ESC) {
      this.setState({
        searchResults: [],
        searchIsLoading: false,
      });

      // $FlowFixMe
      return input && input.focus();
    }

    if (e.keyCode === ARROW_DOWN) {
      if (indexOfFocusedSearchResult === searchResults.length - 1) return;
      if (searchResults.length === 1) return;

      // 2
      this.setState({
        focusedSearchResult: searchResults[indexOfFocusedSearchResult + 1].id,
      });

      return;
    }

    if (e.keyCode === ARROW_UP) {
      // 1
      if (indexOfFocusedSearchResult === 0) return;
      if (searchResults.length === 1) return;

      // 2
      this.setState({
        focusedSearchResult: searchResults[indexOfFocusedSearchResult - 1].id,
      });

      return;
    }

    if (e.keyCode === ENTER) {
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
        {searchIsLoading && (
          <SearchSpinnerContainer>
            <Spinner size={16} color={'brand.default'} />
          </SearchSpinnerContainer>
        )}

        <ComposerInput
          ref="input"
          type="text"
          value={searchString}
          placeholder="Search for people..."
          onChange={this.handleChange}
          autoFocus={true}
        />

        {// user has typed in a search string
        searchString && (
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
                      {user.username && (
                        <SearchResultUsername>
                          @{user.username}
                        </SearchResultUsername>
                      )}
                    </SearchResultTextContainer>
                  </SearchResult>
                );
              })}

            {searchResults.length === 0 && (
              <SearchResult>
                <SearchResultTextContainer>
                  <SearchResultNull>
                    No users found matching "{searchString}"
                  </SearchResultNull>
                </SearchResultTextContainer>
              </SearchResult>
            )}
          </SearchResultsDropdown>
        )}
      </ComposerInputWrapper>
    );
  }
}

export default compose(
  withApollo,
  withRouter,
  connect(),
  pure
)(Search);
