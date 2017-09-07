// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { withApollo } from 'react-apollo';
// $FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { Link } from 'react-router-dom';
// $FlowFixMe
import { connect } from 'react-redux';
import { track } from '../../../../helpers/events';
import { addToastWithTimeout } from '../../../../actions/toasts';
import { Button, OutlineButton } from '../../../../components/buttons';
import { toggleCommunityMembershipMutation } from '../../../../api/community';
import { findDOMNode } from 'react-dom';
import { throttle } from '../../../../helpers/utils';
import { SEARCH_COMMUNITIES_QUERY } from '../../../../api/community';
import { Spinner } from '../../../../components/globals';
import {
  SearchWrapper,
  SearchInput,
  SearchInputWrapper,
  SearchSpinnerContainer,
  SearchResultsDropdown,
  SearchResult,
  SearchResultNull,
  SearchResultImage,
  SearchResultMetaWrapper,
  SearchResultName,
  SearchResultMetadata,
  SearchIcon,
  SearchResultDescription,
} from './style';

class Search extends Component {
  state: {
    searchString: string,
    searchResults: Array<any>,
    searchIsLoading: boolean,
    focusedSearchResult: string,
    isFocused: boolean,
    loading: string,
  };

  constructor() {
    super();

    this.state = {
      searchString: '',
      searchResults: [],
      searchIsLoading: false,
      focusedSearchResult: '',
      isFocused: true,
      loading: '',
    };

    // only kick off search query every 200ms
    this.search = throttle(this.search, 500);
  }

  toggleMembership = communityId => {
    this.setState({
      loading: communityId,
    });

    this.props
      .toggleCommunityMembership({ communityId })
      .then(({ data: { toggleCommunityMembership } }) => {
        this.setState({
          loading: '',
        });

        const isMember =
          toggleCommunityMembership.communityPermissions.isMember;

        track('community', isMember ? 'joined' : 'unjoined', null);
        track(
          'onboarding',
          isMember ? 'community joined' : 'community unjoined',
          null
        );

        const str = isMember
          ? `Joined ${toggleCommunityMembership.name}!`
          : `Left ${toggleCommunityMembership.name}.`;

        const type = isMember ? 'success' : 'neutral';

        this.props.joinedCommunity(isMember ? 1 : -1, false);

        const { searchResults } = this.state;

        // because we are using state to display the search results,
        // we can't rely on the apollo cache to automatically update the
        // display of the join/leave buttons in the search results dropdown
        // so we update the state manually with the new membership boolean
        // returned from the mutation
        const newSearchResults = searchResults.map(community => {
          if (community.id === toggleCommunityMembership.id) {
            const newObj = Object.assign({}, ...community, {
              ...community,
              communityPermissions: {
                ...community.communityPermissions,
                isMember: isMember,
              },
            });

            return newObj;
          }
          return community;
        });

        this.setState({
          searchResults: newSearchResults,
        });
      })
      .catch(err => {
        this.setState({
          loading: '',
        });
        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  search = (searchString: string) => {
    const { client } = this.props;

    // start the input loading spinner
    this.setState({
      searchIsLoading: true,
    });

    // trigger the query
    client
      .query({
        query: SEARCH_COMMUNITIES_QUERY,
        variables: { string: searchString },
      })
      .then(({ data: { searchCommunities } }) => {
        const searchResults = searchCommunities;
        // sort by membership count
        const sorted = searchResults
          .slice()
          .sort((a, b) => {
            return b.metaData.members - a.metaData.members;
          })
          // don't display communities where the user is blocked
          .filter(community => !community.communityPermissions.isBlocked);

        if (!sorted || sorted.length === 0) {
          return this.setState({
            searchResults: [],
            searchIsLoading: false,
            focusedSearchResult: '',
          });
        } else {
          return this.setState({
            searchResults: sorted,
            searchIsLoading: false,
            focusedSearchResult: sorted[0].id,
          });
        }
      });
  };

  handleKeyPress = (e: any) => {
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

      input.focus();
      return;
    }

    // if user presses enter
    if (e.keyCode === 13) {
      if (
        !searchResults[indexOfFocusedSearchResult] ||
        searchResults[indexOfFocusedSearchResult] === undefined
      ) {
        return;
      }

      const id = searchResults[indexOfFocusedSearchResult].id;
      return this.toggleMembership(id);
    }

    // if person presses down
    if (e.keyCode === 40) {
      if (indexOfFocusedSearchResult === searchResults.length - 1) return;
      if (searchResults.length === 1) return;

      return this.setState({
        focusedSearchResult: searchResults[indexOfFocusedSearchResult + 1].id,
      });
    }

    // if person presses up
    if (e.keyCode === 38) {
      if (indexOfFocusedSearchResult === 0) return;
      if (searchResults.length === 1) return;

      return this.setState({
        focusedSearchResult: searchResults[indexOfFocusedSearchResult - 1].id,
      });
    }
  };

  handleChange = (e: any) => {
    const string = e.target.value.toLowerCase().trim();

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
      loading,
    } = this.state;

    const isMobile = window.innerWidth < 768;

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
            autoFocus={!isMobile}
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
                    <SearchResultImage community src={community.profilePhoto} />

                    <SearchResultMetaWrapper>
                      <SearchResultName>{community.name}</SearchResultName>
                      {community.metaData && (
                        <SearchResultMetadata>
                          {community.metaData.members} members
                        </SearchResultMetadata>
                      )}
                      <SearchResultDescription>
                        {community.description}
                      </SearchResultDescription>
                    </SearchResultMetaWrapper>

                    <div>
                      {community.communityPermissions.isMember ? (
                        <OutlineButton
                          onClick={() => this.toggleMembership(community.id)}
                          gradientTheme="none"
                          color={'pro.alt'}
                          hoverColor={'pro.default'}
                          loading={loading === community.id}
                        >
                          Joined!
                        </OutlineButton>
                      ) : (
                        <Button
                          onClick={() => this.toggleMembership(community.id)}
                          loading={loading === community.id}
                          gradientTheme={'success'}
                          style={{ fontSize: '16px' }}
                          icon={'plus'}
                        >
                          Join
                        </Button>
                      )}
                    </div>
                  </SearchResult>
                );
              })}

            {searchResults.length === 0 &&
            isFocused && (
              <SearchResult>
                <SearchResultNull>
                  <p>No communities found matching "{searchString}"</p>
                  <Link to={'/new/community'}>
                    <Button>Create a Community</Button>
                  </Link>
                </SearchResultNull>
              </SearchResult>
            )}
          </SearchResultsDropdown>
        )}
      </SearchWrapper>
    );
  }
}

export default compose(
  withApollo,
  withRouter,
  toggleCommunityMembershipMutation,
  connect()
)(Search);
