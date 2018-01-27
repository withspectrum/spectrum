// @flow
import * as React from 'react';
import { withApollo } from 'react-apollo';
import { withRouter } from 'react-router';
import compose from 'recompose/compose';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import { track } from '../../../../helpers/events';
import { addToastWithTimeout } from '../../../../actions/toasts';
import { Button, OutlineButton } from '../../../../components/buttons';
import toggleCommunityMembershipMutation from 'shared/graphql/mutations/community/toggleCommunityMembership';
import type { ToggleCommunityMembershipType } from 'shared/graphql/mutations/community/toggleCommunityMembership';
import { throttle } from '../../../../helpers/utils';
import { searchCommunitiesQuery } from 'shared/graphql/queries/search/searchCommunities';
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

type State = {
  searchString: string,
  searchResults: Array<any>,
  searchIsLoading: boolean,
  focusedSearchResult: string,
  isFocused: boolean,
  loading: string,
};

type Props = {
  toggleCommunityMembership: Function,
  joinedCommunity: Function,
  dispatch: Function,
  client: Object,
};

class Search extends React.Component<Props, State> {
  input: React.Node;

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
      .then(({ data }: ToggleCommunityMembershipType) => {
        this.setState({
          loading: '',
        });

        const { toggleCommunityMembership } = data;

        const isMember =
          toggleCommunityMembership.communityPermissions.isMember;

        track('community', isMember ? 'joined' : 'unjoined', null);
        track(
          'onboarding',
          isMember ? 'community joined' : 'community unjoined',
          null
        );

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

        return;
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

    if (!searchString || searchString.length === 0) {
      return this.setState({
        searchIsLoading: false,
      });
    }

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
      .then(({ data: { search } }) => {
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

        const searchResults = search.searchResultsConnection.edges.map(
          c => c.node
        );
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
      })
      .catch(err => {
        console.log('Error searching for communities: ', err);
      });
  };

  handleKeyPress = (e: any) => {
    const { searchResults, focusedSearchResult } = this.state;

    const input = this.input;
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
    const val = e.target.val;
    if (!val || val.length === 0) return;

    const string = val.toLowerCase().trim();

    // $FlowIssue
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
            innerRef={c => {
              this.input = c;
            }}
            type="text"
            value={searchString}
            placeholder="Search for communities or topics..."
            onChange={this.handleChange}
            onFocus={this.onFocus}
            autoFocus={window.innerWidth < 768}
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
                    <SearchResultImage
                      community={community}
                      src={community.profilePhoto}
                    />

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
                          color={'success.alt'}
                          hoverColor={'success.default'}
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
                    <p>No communities found matching “{searchString}”</p>
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
