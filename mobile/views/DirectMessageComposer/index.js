// @flow
import React from 'react';
import { throttle, debounce } from 'throttle-debounce';
import Text from '../../components/Text';
import TouchableHighlight from '../../components/TouchableHighlight';
import ChatInput from '../../components/ChatInput';
import PeopleSearchView from '../Search/PeopleSearchView';
import createDirectMessageThread, {
  type CreateDirectMessageThreadProps,
} from '../../../shared/graphql/mutations/directMessageThread/createDirectMessageThread';
import { getUserById } from '../../../shared/graphql/queries/user/getUser';
import {
  ComposerWrapper,
  SearchInputArea,
  SelectedUsers,
  SelectedUserPill,
  UserSearchInput,
} from './style';
import { events, track } from '../../utils/analytics';
import type { NavigationProps } from 'react-navigation';
import type { ComponentType } from 'react';
import { FullscreenNullState } from '../../components/NullStates';

const SelectedUser: ComponentType<{
  id: string,
  onPressHandler: Function,
}> = getUserById(({ data, onPressHandler }) => {
  if (data.user)
    return (
      <TouchableHighlight onPress={onPressHandler}>
        <SelectedUserPill>
          <Text
            type="body"
            style={{ marginTop: 0, fontSize: 14 }}
            color={props => props.theme.brand.default}
          >
            {data.user.name}
            {'  ✕'}
          </Text>
        </SelectedUserPill>
      </TouchableHighlight>
    );

  return null;
});

type Props = {
  ...$Exact<NavigationProps>,
  ...$Exact<CreateDirectMessageThreadProps>,
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

  render() {
    return (
      <ComposerWrapper>
        <SearchInputArea>
          <SelectedUsers empty={this.state.selectedUsers.length === 0}>
            {this.state.selectedUsers.map(userId => (
              <SelectedUser
                key={userId}
                id={userId}
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
          />
        )}
        <ChatInput onSubmit={this.onSubmit} />
      </ComposerWrapper>
    );
  }
}

export default createDirectMessageThread(DirectMessageComposer);
