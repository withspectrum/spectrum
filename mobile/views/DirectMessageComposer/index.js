// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import compose from 'recompose/compose';
import type { NavigationProps } from 'react-navigation';
import { withCurrentUser } from '../../components/WithCurrentUser';
import { throttle, debounce } from 'throttle-debounce';
import withSafeView from '../../components/SafeAreaView';
import ChatInput from '../../components/ChatInput';
import PeopleSearchView from '../Search/PeopleSearchView';
import getCurrentUserDMThreadConnection from '../../../shared/graphql/queries/directMessageThread/getCurrentUserDMThreadConnection';
import createDirectMessageThread, {
  type CreateDirectMessageThreadType,
  type CreateDirectMessageThreadProps,
} from '../../../shared/graphql/mutations/directMessageThread/createDirectMessageThread';
import type { GetUserType } from '../../../shared/graphql/queries/user/getUser';
import {
  ComposerWrapper,
  SearchInputArea,
  SelectedUsers,
  UserSearchInput,
} from './style';
import { events, track } from '../../utils/analytics';
import { FullscreenNullState } from '../../components/NullStates';
import SelectedUser from './SelectedUser';
import { addToast } from '../../actions/toasts';

type Props = {
  ...$Exact<NavigationProps>,
  ...$Exact<CreateDirectMessageThreadProps>,
  currentUser: GetUserType,
  presetUserIds?: Array<string>,
  dispatch: Dispatch<Object>,
};

type State = {
  wipSearchString: ?string,
  searchString: ?string,
  selectedUsers: string[],
};

class DirectMessageComposer extends React.Component<Props, State> {
  state = {
    wipSearchString: '',
    searchString: '',
    selectedUsers: [],
  };

  searchInput: ?{
    focus: () => void,
  };

  constructor() {
    super();
    this.searchDebounced = debounce(300, this.searchDebounced);
    this.searchThrottled = throttle(300, this.searchThrottled);
  }

  componentDidMount() {
    track(events.DIRECT_MESSAGE_THREAD_COMPOSER_VIEWED);

    const { presetUserIds } = this.props;

    if (presetUserIds && presetUserIds.length > 0) {
      this.setState({
        selectedUsers: [...presetUserIds],
      });
    }
  }

  onChangeText = (text: string) => {
    this.setState({
      wipSearchString: text,
    });
  };

  onChangeText = (text: string) => {
    this.setState({ wipSearchString: text }, () => {
      const { wipSearchString } = this.state;
      if (wipSearchString && wipSearchString.length < 5) {
        this.searchThrottled(wipSearchString);
      } else {
        this.searchDebounced(wipSearchString);
      }
    });
  };

  onFinishTyping = (e: { nativeEvent: { text: string } }) => {
    this.search(e.nativeEvent.text);
  };

  searchDebounced = (searchString: ?string) => {
    this.setState({
      searchString,
    });
  };

  searchThrottled = (searchString: ?string) => {
    this.setState({
      searchString,
    });
  };

  search = (searchString: ?string) => {
    this.setState({
      searchString,
    });
  };

  selectUser = (userId: string) => {
    this.setState(prev => ({
      selectedUsers: prev.selectedUsers.concat([userId]),
      wipSearchString: '',
      searchString: '',
    }));
    this.searchInput && this.searchInput.focus();
  };

  removeSelectedUser = (userId: string) => () => {
    this.setState(prev => ({
      selectedUsers: prev.selectedUsers.filter(
        selectedId => selectedId !== userId
      ),
    }));
  };

  onSubmit = (text: string) => {
    if (this.state.selectedUsers.length === 0) return;
    this.props
      .createDirectMessageThread({
        participants: this.state.selectedUsers,
        message: {
          messageType: 'text',
          threadType: 'directMessageThread',
          content: {
            body: text,
          },
        },
      })
      .then((result: CreateDirectMessageThreadType) => {
        const { navigation, dispatch } = this.props;
        const { state: { params } } = navigation;

        // if the user composed this thread from the direct messages tab, take
        // them to the thread
        if (
          params &&
          params.entryPoint &&
          params.entryPoint === 'DirectMessages'
        ) {
          return navigation.navigate('DirectMessageThread', {
            id: result.data.createDirectMessageThread.id,
          });
        }

        const newDM = result.data.createDirectMessageThread;

        // otherwise if they composed the thread from outside of the messages tab,
        // just close the composer and show a toast confirming that the message
        // was sent in the background
        setTimeout(
          () =>
            dispatch(
              addToast({
                type: 'success',
                message: 'Message sent!',
                icon: 'message-new',
                onPressHandler: () =>
                  navigation.navigate({
                    routeName: 'DirectMessageThread',
                    key: newDM.id,
                    params: {
                      id: newDM.id,
                    },
                  }),
              })
            ),
          1000
        );

        return navigation.goBack();
      })
      .catch(err => {
        console.error(err);
      });
  };

  filterResults = (results: Array<Object>) => {
    const { currentUser } = this.props;
    const { selectedUsers } = this.state;

    return results
      .filter(row => row.id !== currentUser.id)
      .filter(row => selectedUsers.indexOf(row.id) < 0);
  };

  render() {
    return (
      <ComposerWrapper>
        <SearchInputArea>
          <SelectedUsers
            horizontal
            empty={this.state.selectedUsers.length === 0}
          >
            {this.state.selectedUsers.map(userId => (
              <SelectedUser
                key={userId}
                id={userId}
                keyboardShouldPersistTaps={'always'}
                onPressHandler={this.removeSelectedUser(userId)}
              />
            ))}
          </SelectedUsers>
          <UserSearchInput
            onChangeText={this.onChangeText}
            onEndEditing={this.onFinishTyping}
            onSubmitEditing={this.onFinishTyping}
            value={this.state.wipSearchString}
            returnKeyType="search"
            autoFocus
            innerRef={elem => (this.searchInput = elem)}
            placeholder={'Search for people...'}
          />
        </SearchInputArea>

        {!this.state.searchString && (
          <FullscreenNullState title={''} subtitle={''} />
        )}

        {this.state.searchString && (
          <PeopleSearchView
            onPress={this.selectUser}
            queryString={this.state.searchString}
            keyboardShouldPersistTaps={'always'}
            filter={results => this.filterResults(results)}
          />
        )}

        <ChatInput
          onSubmit={this.onSubmit}
          disableSubmit={this.state.selectedUsers.length === 0}
        />
      </ComposerWrapper>
    );
  }
}

export default compose(
  connect(),
  withCurrentUser,
  getCurrentUserDMThreadConnection,
  createDirectMessageThread,
  withSafeView
)(DirectMessageComposer);
