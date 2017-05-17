// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { withApollo } from 'react-apollo';
// $FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
import compose from 'recompose/compose';
import Messages from '../components/messages';
import Header from '../components/header';
import ChatInput from '../../../components/chatInput';
import { MessagesContainer, ViewContent } from '../style';
import { findDOMNode } from 'react-dom';
import { GET_DIRECT_MESSAGE_GROUP_QUERY } from '../queries';
import { throttle } from '../../../helpers/utils';
import { SEARCH_USERS_QUERY } from '../../../api/user';
import { Spinner } from '../../../components/globals';
import { Loading } from '../../../components/loading';
import {
  createDirectMessageGroupMutation,
} from '../../../api/directMessageGroup';
import {
  ComposerInputWrapper,
  Grow,
  SelectedUsersPills,
  Pill,
  SearchSpinnerContainer,
  ComposerInput,
  SearchResultsDropdown,
  SearchResult,
  SearchResultNull,
  SearchResultUsername,
  SearchResultDisplayName,
  SearchResultTextContainer,
  SearchResultImage,
} from '../components/style';

class NewThread extends Component {
  state: {
    searchString: string,
    searchResults: Array<any>,
    searchIsLoading: boolean,
    selectedUsersForNewThread: Array<any>,
    focusedSearchResult: string, // id
    focusedSelectedUser: string, // id
    existingThreadBasedOnSelectedUsers: string, // id
    existingThreadWithMessages: Object,
    loadingExistingThreadMessages: boolean,
  };

  constructor() {
    super();

    this.state = {
      // user types in a string that returns all users whose username
      // or displayName contains the string
      searchString: '',
      // the query returns an array of user objects. this is used to populate
      // the search dropdown
      searchResults: [],
      // if the query is still fetching, a loading indicator appears in
      // the search bar
      searchIsLoading: false,
      // as a user selects users for the new direct message thread, we add
      // them to an array. this array will be used for two functions:
      // 1. Map against the user's existing DM threads to see if a thread
      //    with the selected users already exists
      // 2. If no existing thread is found, this is the array that will be
      //    used in the DMThread creation mutation
      selectedUsersForNewThread: [],
      // represents a userId of a search result that is currently "focused"
      // in the search dropdown. This allows a user to press up/down, or enter
      // to quickly navigation the search results dropdown
      focusedSearchResult: '',
      // when users have been added to `selectedUsersForNewThread`, they can
      // be removed by either backspacing them away, or a user can click on
      // the person's name, and then press backspace, to remove that specific
      // user
      focusedSelectedUser: '',
      // if an existing thread is found based on the selected users, we will
      // kick off a query to get that thread's messages and load it inline
      // we will also use this object to make sure the chat input sends messages
      // to the existing group and doesn't create a new one
      existingThreadBasedOnSelectedUsers: '',
      // after we get the messages from the server, we'll store the full object
      existingThreadWithMessages: {},
      // if the query is loading, we show a centered spinner in the middle of
      // the page where the messages will appear
      loadingExistingThreadMessages: false,
    };

    // only kick off search query every 200ms
    this.search = throttle(this.search, 200);
  }

  /*
    Add event listeners when the component mounts - will be listening
    for up, down, backspace, escape, and enter, to trigger different
    functions depending on the context or state of the composer
  */
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
  }
  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  /*
    takes a string that gets sent to the server and matched against all
    user's displayNames and usernames
  */
  search = (string: string) => {
    const { selectedUsersForNewThread } = this.state;
    const { currentUser, client } = this.props;

    // start the input loading spinner
    this.setState({
      searchIsLoading: true,
    });

    // trigger the query
    client
      .query({
        query: SEARCH_USERS_QUERY,
        variables: {
          string,
        },
      })
      .then(({ data: { searchUsers } }) => {
        // if we return users from the search query, stop the loading
        // spinner, populate the searchResults array, and focus the first
        // result
        if (searchUsers.length > 0) {
          // create an array of user ids if the user has already selected people
          // for the thread
          const selectedUsersIds =
            selectedUsersForNewThread &&
            selectedUsersForNewThread.map(user => user.uid);

          // filter the search results to only show users who aren't already selected
          // then filter that list to remove the currentUser so you can't message yourself
          let searchResults = selectedUsersForNewThread
            ? searchUsers
                .filter(user => selectedUsersIds.indexOf(user.uid) < 0)
                .filter(user => user.uid !== currentUser.uid)
            : searchUsers.filter(user => user.uid !== currentUser.uid);

          this.setState({
            // if the search results are totally filtered out of the selectedUsers,
            // return an empty array
            searchResults: searchResults.length > 0 ? searchResults : [],
            searchIsLoading: false,
            // if all results are filtered, clear the focused search result
            focusedSearchResult: searchResults.length > 0
              ? searchResults[0].uid
              : '',
          });
          // otherwise if no results are found, clear the above
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
    // destructure the whole state object
    const {
      searchString,
      searchResults,
      searchIsLoading,
      selectedUsersForNewThread,
      focusedSearchResult,
      focusedSelectedUser,
      existingThreadBasedOnSelectedUsers,
      loadingExistingThreadMessages,
    } = this.state;

    // create a reference to the input - we will use this to call .focus()
    // after certain events (like pressing backspace or enter)
    const input = findDOMNode(this.refs.input);

    // create temporary arrays of IDs from the searchResults and selectedUsers
    // to more easily manipulate the ids
    const searchResultIds =
      searchResults && searchResults.map(user => user.uid);
    const selectedUsersIds =
      selectedUsersForNewThread &&
      selectedUsersForNewThread.map(user => user.uid);

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

    /*
      if a user presses backspace
      1. Determine if they have focused on a selectedUser pill - if so, they
         are trying to delete it
      2. Determine if there are any more characters left in the search string.
         If so, they are just typing a search query as normal
      3. If there are no more characters left in the search string, we need
         to check if the user has already selected people to message. If so,
         we remove the last one in the array
      4. If no more characters are in the search query, and no users are
         selected to be messaged, we can just return
    */
    if (e.keyCode === 8) {
      // 1. If there is a selectedUser that has been focused, delete it
      if (focusedSelectedUser) {
        const newSelectedUsers = selectedUsersForNewThread.filter(
          user => user.uid !== focusedSelectedUser
        );

        this.setState({
          selectedUsersForNewThread: newSelectedUsers,
          focusedSelectedUser: '',
        });

        // recheckfor an existing direct message thread on the server
        this.getMessagesForExistingDirectMessageThread();

        // focus the search input
        input.focus();

        return;
      }

      // 2. If there are more characters left in the search string
      if (searchString.length > 0) return;

      // 3. The user is trying to delete selected users. If one isn't selected,
      //    select it.
      //    Note: If the user presses backspace again it will trigger step #1
      //    above
      if (selectedUsersForNewThread.length > 0 && !focusedSelectedUser) {
        // recheck for an existing thread if the user stops searching but
        // still has selected users for the new thread
        this.getMessagesForExistingDirectMessageThread();

        const focused =
          selectedUsersForNewThread[selectedUsersForNewThread.length - 1].uid;

        this.setState({
          focusedSelectedUser: focused,
        });

        return;
      }

      // 4
      input.focus();
      return;
    }

    /*
      If the person presses escape:
      1. If there are focused selected users, clear them
      2. If there are search results, clear them to hide the dropdown
    */
    if (e.keyCode === 27) {
      this.setState({
        searchResults: [],
        searchIsLoading: false,
        loadingExistingThreadMessages: false,
        focusedSelectedUser: '',
      });

      input.focus();
      return;
    }

    /*
      if person presses down
      1. If the user is at the last item in the search results, don't
      do anything
      2. Focus the next user in the search results
    */
    if (e.keyCode === 40) {
      // 1
      if (indexOfFocusedSearchResult === searchResults.length - 1) return;

      // 2
      this.setState({
        focusedSearchResult: searchResults[indexOfFocusedSearchResult + 1].uid,
      });

      return;
    }

    /*
      if person presses up
      1. If the user is at the first`` item in the search results, don't
      do anything
      2. Focus the previous user in the search results
    */
    if (e.keyCode === 38) {
      // 1
      if (indexOfFocusedSearchResult === 0) return;

      // 2
      this.setState({
        focusedSearchResult: searchResults[indexOfFocusedSearchResult - 1].uid,
      });

      return;
    }

    /*
      if person presses enter
      1. If there are search results and one of them is focused, add that user
      to the selectedUsers state, clear the searchString, clear the searchResults,
      and stop loading. Then kick off a new search to see if there is an
      existing thread containing the selected users
      2. Otherwise do nothing
    */
    if (e.keyCode === 13) {
      // 1
      this.addUserToSelectedUsersList(
        searchResults[indexOfFocusedSearchResult]
      );
      return;
    }
  };

  setFocusedSelectedUser = (id: string) => {
    this.setState({
      focusedSelectedUser: id,
    });

    return;
  };

  addUserToSelectedUsersList = (user: Object) => {
    const { selectedUsersForNewThread } = this.state;

    // add the new user to the state array
    selectedUsersForNewThread.push(user);

    this.setState({
      selectedUsersForNewThread,
      searchResults: [],
      searchString: '',
      focusedSearchResult: '',
      searchIsLoading: false,
      existingThreadBasedOnSelectedUsers: '',
      existingThreadWithMessages: {},
    });

    // trigger a new search for an existing thread
    this.getMessagesForExistingDirectMessageThread();
  };

  handleChange = (e: any) => {
    const { existingThreadBasedOnSelectedUsers } = this.state;

    // unfocus any selected user pills
    this.setState({
      focusedSelectedUser: '',
    });

    // if a user keeps typing, assume they aren't trying to message a different
    // set of people
    if (existingThreadBasedOnSelectedUsers) {
      this.setState({
        loadingExistingThreadMessages: false,
      });
    }

    const string = e.target.value.toLowerCase().trim();

    // set the searchstring to state
    this.setState({
      searchString: string,
    });

    // trigger a new search based on the search input
    this.search(string);
  };

  /*
    This method is used to determine if the selected users in the new thread
    being composed match an existing DM thread for the current user. If we
    find a match, we should load the messages for that thread and prepare
    the chatInput to send any messages to that existing thread.

    If no matches are found, we will return a falsey value which will tell
    the chat input that it is creating a new thread based on the current
    array of selectedUsers in the state
  */
  getMessagesForExistingDirectMessageThread = () => {
    const { groups, currentUser, client } = this.props;
    const { selectedUsersForNewThread } = this.state;

    // user hasn't created any dm threads yet,
    if (groups.length === 0) {
      return;
    }

    // if there are no selected users in the thread
    if (selectedUsersForNewThread.length === 0) {
      this.setState({
        existingThreadBasedOnSelectedUsers: '',
        loadingExistingThreadMessages: false,
      });

      return;
    }

    /*
      If we made it here it means that the user has selected people to message
      in the composer and that they have some existing threads that were
      already returned from the server. What we need to do now is determine
      if the selectedUsers in the composer exactly match the users of an
      existing thread.

      We'll do this by:
      1. Creating a new array of the user's existing DM threads with the
      following shape:
        {
          id
          users: [ uid ]
        }
      where the users array does *not* contain the currentUser uid. It has
      to be cleared becaues the composer input does *not* contain the current
      user.

      2. For each of these groups, we'll sort the users, sort the composer's
      selected users and look for a match.
    */

    // 1. Create a new array of cleaned up groups objects
    const cleanedExistingThreads = groups.map(group => {
      return {
        id: group.id,
        users: group.users
          .filter(user => user.uid !== currentUser.uid)
          .map(user => user.uid),
      };
    });

    // 2. Sort both arrays of user IDs and look for a match
    const sortedSelectedUsersForNewThread = selectedUsersForNewThread
      .map(user => user.uid)
      .sort()
      .join('');

    // will return null or an object
    const existingThread = cleanedExistingThreads.filter(group => {
      const sortedUsers = group.users.sort().join('');

      if (sortedUsers === sortedSelectedUsersForNewThread) {
        return group;
      } else {
        return null;
      }
    });

    // if an existing thread was found, set it to the state and get the messages
    // from the server
    if (existingThread.length > 0) {
      this.setState({
        loadingExistingThreadMessages: true,
        existingThreadBasedOnSelectedUsers: existingThread[0].id,
      });

      client
        .query({
          query: GET_DIRECT_MESSAGE_GROUP_QUERY,
          variables: {
            id: existingThread[0].id,
          },
        })
        .then(({ data: { directMessageGroup } }) => {
          // stop loading
          this.setState({
            loadingExistingThreadMessages: false,
          });

          // if messages were found
          if (directMessageGroup.id) {
            this.setState({
              existingThreadWithMessages: directMessageGroup,
            });
            // if no messages were found
          } else {
            this.setState({
              existingThreadWithMessages: {},
              existingThreadBasedOnSelectedUsers: '',
            });
          }
        });
    }
  };

  componentDidUpdate() {
    this.forceScrollToBottom();
  }

  forceScrollToBottom = () => {
    if (!this.scrollBody) return;
    let node = this.scrollBody;
    node.scrollTop = node.scrollHeight - node.clientHeight;
  };

  createThread = message => {
    const { selectedUsersForNewThread } = this.state;
    const input = {
      users: selectedUsersForNewThread.map(user => user.uid),
      message,
    };

    this.props.createDirectMessageGroup(input).then(({
      data: { createDirectMessageGroup },
    }) => {
      // NOTE: I cannot get the Apollo store to update properly with the
      // new group. Forcing a refresh works, although it's a less ideal UX
      window.location.href = `/messages/${createDirectMessageGroup.id}`;
      // this.props.history.push(`/messages/${createDirectMessageGroup.id}`)
    });
  };

  render() {
    const {
      searchString,
      selectedUsersForNewThread,
      searchIsLoading,
      searchResults,
      focusedSelectedUser,
      focusedSearchResult,
      existingThreadBasedOnSelectedUsers,
      loadingExistingThreadMessages,
      existingThreadWithMessages,
    } = this.state;
    const { currentUser } = this.props;

    return (
      <MessagesContainer>
        <ComposerInputWrapper>
          {// if users have been selected, show them as pills
          selectedUsersForNewThread.length > 0 &&
            <SelectedUsersPills>

              {selectedUsersForNewThread.map(user => {
                return (
                  <Pill
                    selected={focusedSelectedUser === user.uid}
                    onClick={() => this.setFocusedSelectedUser(user.uid)}
                    key={user.uid}
                  >
                    {user.displayName}
                  </Pill>
                );
              })}

            </SelectedUsersPills>}

          {searchIsLoading &&
            <SearchSpinnerContainer>
              <Spinner size={16} color={'brand.default'} />
            </SearchSpinnerContainer>}

          <ComposerInput
            ref="input"
            type="text"
            value={searchString}
            placeholder="Search for users..."
            onChange={this.handleChange}
            autoFocus={true}
          />

          {// user has typed in a search string
          searchString &&
            //if there are selected users already, we manually shift
            // the search results position down
            <SearchResultsDropdown moved={selectedUsersForNewThread.length > 0}>

              {searchResults.length > 0 &&
                searchResults.map(user => {
                  return (
                    <SearchResult
                      focused={focusedSearchResult === user.uid}
                      key={user.uid}
                      onClick={() => this.addUserToSelectedUsersList(user)}
                    >
                      <SearchResultImage src={user.photoURL} />
                      <SearchResultTextContainer>
                        <SearchResultDisplayName>
                          {user.displayName}
                        </SearchResultDisplayName>
                        <SearchResultUsername>
                          @{user.username}
                        </SearchResultUsername>
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

        <ViewContent
          moved={selectedUsersForNewThread.length > 0}
          innerRef={scrollBody => this.scrollBody = scrollBody}
        >
          {existingThreadWithMessages &&
            existingThreadWithMessages.id &&
            <Header
              group={existingThreadWithMessages}
              currentUser={currentUser}
            />}

          {existingThreadBasedOnSelectedUsers &&
            <Messages
              id={existingThreadBasedOnSelectedUsers}
              currentUser={currentUser}
            />}

          {!existingThreadBasedOnSelectedUsers &&
            <Grow>
              {loadingExistingThreadMessages &&
                <Spinner size={16} color={'brand.default'} />}
            </Grow>}

        </ViewContent>

        <ChatInput
          thread={
            existingThreadBasedOnSelectedUsers || 'newDirectMessageThread'
          }
          createThread={this.createThread}
        />
      </MessagesContainer>
    );
  }
}

export default compose(
  withApollo,
  withRouter,
  createDirectMessageGroupMutation
)(NewThread);
