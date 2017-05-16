// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withApollo } from 'react-apollo';
import { findDOMNode } from 'react-dom';
import { GET_DIRECT_MESSAGE_GROUP_QUERY } from '../queries';
import { throttle } from '../../../helpers/utils';
import { SEARCH_USERS_QUERY } from '../../../api/user';
import { Spinner } from '../../../components/globals';
import { Loading } from '../../../components/loading';
import Messages from './messages';
import ChatInput from '../../../components/chatInput';
import {
  ComposerContainer,
  Grow,
  ComposerInput,
  SearchResultsDropdown,
  SearchResult,
  SearchResultImage,
  SearchResultTextContainer,
  SearchResultDisplayName,
  SearchResultUsername,
  SearchResultNull,
  SearchResultsPills,
  SearchResultPill,
} from './style';

class Composer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      searchInput: '', // what the user types
      searchResults: [], // what the server sends back
      searchResultsAsIds: [], // get ids to check index easily
      loading: false, // true if a request is waiting results
      finalUserListObjects: [], // what the user clicks or selects
      focused: '', // active listener for up/down/enter/esc, uid,
      selectedPill: '',
      existingDmGroup: null,
      loadingExistingGroup: false,
    };

    this.search = throttle(this.search, 500);
  }

  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  handleKeyPress = e => {
    const {
      searchInput,
      searchResultsAsIds,
      searchResults,
      focused,
      finalUserListObjects,
      selectedPill,
    } = this.state;
    const userIds = finalUserListObjects.map(user => user.uid);
    const filteredSearchResults = searchResults.filter(
      user => userIds.indexOf(user.uid) < 0
    );
    const filteredSearchResultsAsIds = filteredSearchResults.map(
      user => user.uid
    );
    const input = findDOMNode(this.refs.input);
    const indexOfFocusedUser = filteredSearchResultsAsIds.indexOf(focused);

    // if person presses backspace
    if (e.keyCode === 8) {
      // if searchinput is empty and a user has already selected some people
      if (selectedPill) {
        const list = finalUserListObjects.filter(
          user => user.uid !== selectedPill
        );

        this.setState({
          finalUserListObjects: list,
          selectedPill: '',
          loadingExistingGroup: false,
        });
        input.focus();
        this.getMessagesForExistingDirectMessageThread();
        return;
      }

      if (searchInput.length === 0 && finalUserListObjects.length > 0) {
        const index = finalUserListObjects.length;
        const trimmedUserListObjects = finalUserListObjects.slice(0, -1);
        const ids = trimmedUserListObjects.map(user => user.uid);
        this.setState({
          finalUserListObjects: [...trimmedUserListObjects],
          loadingExistingGroup: false,
        });
        input.focus();
      }

      this.getMessagesForExistingDirectMessageThread();
    }

    // if person presses esc, clear the results
    if (e.keyCode === 27) {
      this.setState({
        searchResults: [],
        loadingExistingGroup: false,
      });
    }

    // if person presses down
    if (e.keyCode === 40) {
      // if the focused user is at the last item in the list, can't press down
      if (indexOfFocusedUser === filteredSearchResults.length - 1) return;
      this.setState({
        focused: filteredSearchResults[indexOfFocusedUser + 1].uid,
      });
    }

    // if user presses up
    if (e.keyCode === 38) {
      // if the focused user is at the first item in the list, can't press up
      if (indexOfFocusedUser === 0) return;
      this.setState({
        focused: filteredSearchResults[indexOfFocusedUser - 1].uid,
      });
    }

    // if user presses enter
    if (e.keyCode === 13) {
      // add the user to the selected list
      this.addUser(filteredSearchResults[indexOfFocusedUser]);
      // clear the search and dropdown
      this.setState({
        focused: '',
        searchInput: '',
        searchResults: [],
      });

      this.getMessagesForExistingDirectMessageThread();
    }
  };

  handleChange = e => {
    if (this.state.existingDmGroup) {
      this.setState({
        existingDmGroup: null,
      });
    }

    const value = e.target.value.toLowerCase();
    this.setState({
      searchInput: value,
    });

    this.search(value);
  };

  search = string => {
    // search db for users with a displayName or username containing the search
    this.setState({
      loading: true,
    });

    this.props.client
      .query({
        query: SEARCH_USERS_QUERY,
        variables: {
          string,
        },
      })
      .then(({ data: { searchUsers } }) => {
        if (searchUsers.length > 0) {
          this.setState({
            searchResults: searchUsers,
            searchResultsAsIds: searchUsers.map(user => user.uid),
            loading: false,
            focused: searchUsers[0].uid,
          });
        } else {
          this.setState({
            searchResults: [],
            searchResultsAsIds: [],
            loading: false,
            focused: '',
          });
        }
      });
  };

  addUser = user => {
    const list = this.state.finalUserListObjects;
    list.push(user);

    this.setState({
      finalUserListObjects: list,
      searchResults: [],
      searchInput: '',
      focused: '',
    });

    this.getMessagesForExistingDirectMessageThread();
  };

  setFocusedPill = id => {
    const { finalUserListObjects } = this.state;
    const userIds = finalUserListObjects.map(user => user.uid);
    const index = userIds.indexOf(id);
    const selectedPill = finalUserListObjects[index].uid;
    this.setState({
      selectedPill,
    });
  };

  getMessagesForExistingDirectMessageThread = () => {
    const { groups, currentUser } = this.props;
    const { finalUserListObjects } = this.state;

    // user hasn't created any dm threads yet, this has to be new
    if (groups.length === 0) {
      return false;
    }

    this.setState({
      loadingExistingGroup: true,
    });

    if (finalUserListObjects.length === 0) {
      this.setState({
        existingDmGroup: null,
      });
    }

    const finalUserIds = finalUserListObjects.map(user => user.uid);
    const groupsCleaned = groups.map(group => {
      return {
        id: group.id,
        users: group.users
          .filter(user => user.uid !== currentUser.uid)
          .map(user => user.uid),
      };
    });

    // if user hasn't typed in anyone yet, it's false
    if (finalUserIds.length === 0) {
      this.setState({
        loadingExistingGroup: false,
      });
      return false;
    }

    const sortedFinalUserIds = finalUserIds.sort().join('');
    // loop through users dm threads, sort the ids of the members, check against a sorte
    const existingThread = groupsCleaned.filter(group => {
      const sortedUsers = group.users.sort().join('');
      if (sortedUsers === sortedFinalUserIds) {
        return group;
      }
    });

    if (existingThread.length > 0) {
      this.props.client
        .query({
          query: GET_DIRECT_MESSAGE_GROUP_QUERY,
          variables: {
            id: existingThread[0].id,
          },
        })
        .then(({ data: { directMessageGroup } }) => {
          console.log('should be stopping loading');
          if (directMessageGroup) {
            this.setState({
              existingDmGroup: directMessageGroup,
              loadingExistingGroup: false,
            });
          } else {
            this.setState({
              existingDmGroup: null,
            });
          }

          this.setState({
            loadingExistingGroup: false,
          });
        });
    }

    this.setState({
      loadingExistingGroup: false,
    });
  };

  render() {
    const { currentUser } = this.props;
    const {
      searchInput,
      searchResults,
      loading,
      loadingExistingGroup,
      finalUserListObjects,
      focused,
      selectedPill,
      existingDmGroup,
    } = this.state;
    const userIds = finalUserListObjects.length > 0
      ? finalUserListObjects.map(user => user.uid)
      : [];

    const filteredSearchResults = searchResults.length > 0
      ? searchResults.filter(user => userIds.indexOf(user.uid) < 0)
      : [];

    return (
      <ComposerContainer>
        {loading &&
          <span
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px',
              width: '32px',
              height: '32px',
              zIndex: '5',
            }}
          >
            <Spinner size={16} color={'brand.default'} />
          </span>}

        {finalUserListObjects.length > 0 &&
          <SearchResultsPills>
            {finalUserListObjects.map(user => {
              return (
                <SearchResultPill
                  selected={selectedPill === user.uid}
                  onClick={() => this.setFocusedPill(user.uid)}
                  key={user.uid}
                >
                  {user.displayName}
                </SearchResultPill>
              );
            })}
          </SearchResultsPills>}

        <ComposerInput
          ref="input"
          type="text"
          value={searchInput}
          placeholder="Search for users..."
          onChange={this.handleChange}
          autoFocus={true}
        />

        {// search found people
        searchInput &&
          filteredSearchResults.length > 0 &&
          <SearchResultsDropdown moved={finalUserListObjects.length > 0}>
            {filteredSearchResults.map((user, i) => {
              return (
                <SearchResult
                  focused={focused === user.uid}
                  key={user.uid}
                  onClick={() => this.addUser(user)}
                >
                  <SearchResultImage src={user.photoURL} />
                  <SearchResultTextContainer>
                    <SearchResultDisplayName>
                      {user.displayName}
                    </SearchResultDisplayName>
                    <SearchResultUsername>{user.username}</SearchResultUsername>
                  </SearchResultTextContainer>
                </SearchResult>
              );
            })}
          </SearchResultsDropdown>}

        {searchInput &&
          filteredSearchResults.length === 0 &&
          <SearchResultsDropdown>
            <SearchResult>
              <SearchResultTextContainer>
                <SearchResultNull>
                  No users found matching "{searchInput}"
                </SearchResultNull>
              </SearchResultTextContainer>
            </SearchResult>
          </SearchResultsDropdown>}

        {existingDmGroup &&
          finalUserListObjects.length > 0 &&
          <Messages id={existingDmGroup.id} currentUser={currentUser} />}

        {!existingDmGroup &&
          <Grow>
            {loadingExistingGroup &&
              <Spinner size={16} color={'brand.default'} />}
          </Grow>}

        <ChatInput thread={existingDmGroup || 'new'} />
      </ComposerContainer>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
const ComposerWithUser = connect(mapStateToProps)(Composer);
const ComposerWithQuery = withApollo(ComposerWithUser);
export default ComposerWithQuery;
