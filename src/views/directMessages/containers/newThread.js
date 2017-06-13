// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { withApollo } from 'react-apollo';
// $FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
import Messages from '../components/messages';
import Header from '../components/header';
import Titlebar from '../../titlebar';
import ChatInput from '../../../components/chatInput';
import { MessagesContainer, ViewContent } from '../style';
import { findDOMNode } from 'react-dom';
import { GET_DIRECT_MESSAGE_THREAD_QUERY } from '../queries';
import { throttle } from '../../../helpers/utils';
import { track } from '../../../helpers/events';
import { SEARCH_USERS_QUERY } from '../../../api/user';
import { Spinner } from '../../../components/globals';
import { addToastWithTimeout } from '../../../actions/toasts';
import {
  clearDirectMessagesComposer,
} from '../../../actions/directMessageThreads';
import {
  createDirectMessageThreadMutation,
} from '../../../api/directMessageThread';
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
    chatInputIsFocused: boolean,
    threadIsBeingCreated: boolean,
  };

  constructor(props) {
    super(props);

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
      // to the existing thread and doesn't create a new one
      existingThreadBasedOnSelectedUsers: '',
      // after we get the messages from the server, we'll store the full object
      existingThreadWithMessages: {},
      // if the query is loading, we show a centered spinner in the middle of
      // the page where the messages will appear
      loadingExistingThreadMessages: false,
      // if the user is focused on the chat input, we want 'enter' to send
      // a message and create the dm group, and ignore other logic around
      // pressing the 'enter' key
      chatInputIsFocused: false,
      // set to true while a thread is being created, to prevent a user pressing
      // enter twice and accidentally creating two threads
      threadIsBeingCreated: false,
    };

    // only kick off search query every 200ms
    this.search = throttle(this.search, 200);
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
            selectedUsersForNewThread.map(user => user.id);

          // filter the search results to only show users who aren't already selected
          // then filter that list to remove the currentUser so you can't message yourself

          let searchResults = selectedUsersForNewThread
            ? searchUsers
                .filter(user => selectedUsersIds.indexOf(user.id) < 0)
                .filter(user => user.id !== currentUser.id)
            : searchUsers.filter(user => user.id !== currentUser.id);

          this.setState({
            // if the search results are totally filtered out of the selectedUsers,
            // return an empty array
            searchResults: searchResults.length > 0 ? searchResults : [],
            searchIsLoading: false,
            // if all results are filtered, clear the focused search result
            focusedSearchResult: searchResults.length > 0
              ? searchResults[0].id
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
      selectedUsersForNewThread,
      focusedSearchResult,
      focusedSelectedUser,
      chatInputIsFocused,
    } = this.state;

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
         selected to be messaged, we can just return and clear out unneeded
         state
    */
    if (e.keyCode === 8) {
      // 0. if the chat input is focused, don't do anything
      if (chatInputIsFocused) return;

      // 1. If there is a selectedUser that has been focused, delete it
      if (focusedSelectedUser) {
        const newSelectedUsers = selectedUsersForNewThread.filter(
          user => user.id !== focusedSelectedUser
        );

        this.setState({
          selectedUsersForNewThread: newSelectedUsers,
          focusedSelectedUser: '',
          existingThreadBasedOnSelectedUsers: '',
          existingThreadWithMessages: {},
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
          selectedUsersForNewThread[selectedUsersForNewThread.length - 1].id;

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
      // 0. if the chat input is focused, don't do anything
      if (chatInputIsFocused) return;

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
      // 0. if the chat input is focused, don't do anything
      if (chatInputIsFocused) return;

      // 1
      if (indexOfFocusedSearchResult === searchResults.length - 1) return;
      if (searchResults.length === 1) return;

      // 2
      this.setState({
        focusedSearchResult: searchResults[indexOfFocusedSearchResult + 1].id,
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
      // 0. if the chat input is focused, don't do anything
      if (chatInputIsFocused) return;

      // 1
      if (indexOfFocusedSearchResult === 0) return;
      if (searchResults.length === 1) return;

      // 2
      this.setState({
        focusedSearchResult: searchResults[indexOfFocusedSearchResult - 1].id,
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
      // 0. if the chat input is focused, don't do anything
      if (chatInputIsFocused) return;

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
      searchString: e.target.value,
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
    const { threads, currentUser, client } = this.props;
    const { selectedUsersForNewThread } = this.state;

    if (!threads) {
      return;
    }

    // user hasn't created any dm threads yet,
    if (threads && threads.length === 0) {
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
          users: [ id ]
        }
      where the users array does *not* contain the currentUser id. It has
      to be cleared becaues the composer input does *not* contain the current
      user.

      2. For each of these threads, we'll sort the users, sort the composer's
      selected users and look for a match.
    */

    // 1. Create a new array of cleaned up threads objects
    const cleanedExistingThreads = threads.map(thread => {
      return {
        id: thread.id,
        participants: thread.participants
          .filter(user => user.userId !== currentUser.id)
          .map(user => user.userId),
      };
    });

    // 2. Sort both arrays of user IDs and look for a match
    const sortedSelectedUsersForNewThread = selectedUsersForNewThread
      .map(user => user.id)
      .sort()
      .join('');

    // will return null or an object
    const existingThread = cleanedExistingThreads.filter(thread => {
      const sortedUsers = thread.participants.sort().join('');

      if (sortedUsers === sortedSelectedUsersForNewThread) {
        return thread;
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
          query: GET_DIRECT_MESSAGE_THREAD_QUERY,
          variables: {
            id: existingThread[0].id,
          },
        })
        .then(({ data: { directMessageThread } }) => {
          // stop loading
          this.setState({
            loadingExistingThreadMessages: false,
          });

          // if messages were found
          if (directMessageThread.id) {
            this.setState({
              existingThreadWithMessages: directMessageThread,
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

  componentWillMount() {
    // can take an optional param of an array of user objects to automatically
    // populate the new message composer
    const { initNewThreadWithUser } = this.props;

    // if the prop is present, add the users to the selected users state
    if (initNewThreadWithUser.length > 0) {
      this.setState({
        selectedUsersForNewThread: [...initNewThreadWithUser],
      });
    }
  }
  /*
    Add event listeners when the component mounts - will be listening
    for up, down, backspace, escape, and enter, to trigger different
    functions depending on the context or state of the composer
  */
  componentDidMount() {
    document.addEventListener('keydown', this.handleKeyPress, false);
    // clear the redux store of this inited user, in case the person
    // sends more messages later in the session
    this.props.dispatch(clearDirectMessagesComposer());
    if (this.state.selectedUsersForNewThread.length > 0) {
      // trigger a new search for an existing thread with these users
      this.getMessagesForExistingDirectMessageThread();
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyPress, false);
  }

  componentDidUpdate() {
    this.forceScrollToBottom();
  }

  forceScrollToBottom = () => {
    if (!this.scrollBody) return;
    let node = this.scrollBody;
    node.scrollTop = node.scrollHeight - node.clientHeight;
  };

  createThread = ({ messageBody, messageType, file }) => {
    const { selectedUsersForNewThread, threadIsBeingCreated } = this.state;

    // if no users have been selected, break out of this function and throw
    // an error
    if (selectedUsersForNewThread.length < 1) {
      this.props.dispatch(
        addToastWithTimeout(
          'error',
          'Choose some people to send this message to first!'
        )
      );
      return;
    }

    const input = {
      participants: selectedUsersForNewThread.map(user => user.id),
      message: {
        messageType: messageType,
        threadType: 'directMessageThread',
        content: {
          body: messageBody ? messageBody : '',
        },
        file: file ? file : null,
      },
    };

    const isPrivate = selectedUsersForNewThread.length > 1 ? true : false;

    if (threadIsBeingCreated) {
      return;
    } else {
      this.setState({
        threadIsBeingCreated: true,
      });

      this.props
        .createDirectMessageThread(input)
        .then(({ data: { createDirectMessageThread } }) => {
          track(
            'direct message thread',
            `${isPrivate ? 'private thread' : 'group thread'} created`,
            null
          );

          this.setState({
            threadIsBeingCreated: false,
          });

          this.props.history.push(`/messages/${createDirectMessageThread.id}`);
        })
        .catch(err => {
          // if an error happened, the user can try to resend the message to
          // create a new thread
          this.setState({
            threadIsBeingCreated: false,
          });

          this.props.dispatch(addToastWithTimeout('error', err.message));
        });
    }
  };

  onChatInputFocus = () => {
    this.setState({
      chatInputIsFocused: true,
    });
  };

  onChatInputBlur = () => {
    this.setState({
      chatInputIsFocused: false,
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
        <Titlebar
          title={'New Message'}
          provideBack={true}
          backRoute={`/messages`}
          noComposer
        />
        <ComposerInputWrapper>
          {// if users have been selected, show them as pills
          selectedUsersForNewThread.length > 0 &&
            <SelectedUsersPills>

              {selectedUsersForNewThread.map(user => {
                return (
                  <Pill
                    selected={focusedSelectedUser === user.id}
                    onClick={() => this.setFocusedSelectedUser(user.id)}
                    key={user.id}
                  >
                    {user.name}
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
            placeholder="Search for people..."
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
                      focused={focusedSearchResult === user.id}
                      key={user.id}
                      onClick={() => this.addUserToSelectedUsersList(user)}
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

        <ViewContent
          moved={selectedUsersForNewThread.length > 0}
          innerRef={scrollBody => this.scrollBody = scrollBody}
        >
          {existingThreadWithMessages &&
            existingThreadWithMessages.id &&
            <Header
              thread={existingThreadWithMessages}
              currentUser={currentUser}
            />}

          {existingThreadBasedOnSelectedUsers &&
            <Messages
              id={existingThreadBasedOnSelectedUsers}
              currentUser={currentUser}
              forceScrollToBottom={this.forceScrollToBottom}
            />}

          {!existingThreadBasedOnSelectedUsers &&
            <Grow>
              {loadingExistingThreadMessages &&
                <Spinner size={16} color={'brand.default'} />}
            </Grow>}

          <ChatInput
            thread={
              existingThreadBasedOnSelectedUsers || 'newDirectMessageThread'
            }
            createThread={this.createThread}
            onFocus={this.onChatInputFocus}
            onBlur={this.onChatInputBlur}
            threadType={'directMessageThread'}
          />
        </ViewContent>
      </MessagesContainer>
    );
  }
}

const mapStateToProps = state => ({
  initNewThreadWithUser: state.directMessageThreads.initNewThreadWithUser,
});

export default compose(
  withApollo,
  withRouter,
  createDirectMessageThreadMutation,
  connect(mapStateToProps)
)(NewThread);
