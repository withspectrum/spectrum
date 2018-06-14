// @flow
import React from 'react';
import compose from 'recompose/compose';
import { withCurrentUser } from '../../components/WithCurrentUser';
import { throttle, debounce } from 'throttle-debounce';
import ChatInput from '../../components/ChatInput';
import PeopleSearchView from '../Search/PeopleSearchView';
import createDirectMessageThread, {
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
import type { NavigationProps } from 'react-navigation';
import { FullscreenNullState } from '../../components/NullStates';
import SelectedUser from './SelectedUser';

type Props = {
  ...$Exact<NavigationProps>,
  ...$Exact<CreateDirectMessageThreadProps>,
  currentUser: GetUserType,
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
      .then(result => {
        this.props.navigation.navigate('DirectMessageThread', {
          id: result.data.createDirectMessageThread.id,
        });
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

export default compose(withCurrentUser, createDirectMessageThread)(
  DirectMessageComposer
);
