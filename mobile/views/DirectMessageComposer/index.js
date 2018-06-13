// @flow
import React from 'react';
import { TextInput, View } from 'react-native';
import Text from '../../components/Text';
import ChatInput from '../../components/ChatInput';
import { FullscreenNullState } from '../../components/NullStates';
import PeopleSearchView from '../Search/PeopleSearchView';
import { getUserById } from '../../../shared/graphql/queries/user/getUser';
import styled from 'styled-components/native';
import type { NavigationProps } from 'react-navigation';

const ComposerWrapper = styled.View`
  flex-direction: column;
  height: 100%;
  background-color: ${props => props.theme.bg.wash};
`;

const SearchInputArea = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  background-color: ${props => props.theme.bg.default};
  border-bottom-width: 1;
  border-bottom-color: ${props => props.theme.bg.border};
`;

const SelectedUsers = styled.View`
  flex-direction: row;
`;

const SelectedUser = getUserById(({ data, onPressHandler }) => {
  if (data.user) return <Text>{data.user.name}</Text>;

  return null;
});

type Props = {
  ...$Exact<NavigationProps>,
};

type State = {
  wipSearchString: string,
  searchString: string,
  selectedUsers: string[],
};

class DirectMessageComposer extends React.Component<Props, State> {
  state = {
    wipSearchString: '',
    searchString: '',
    selectedUsers: [],
  };

  searchInput = {
    clear: Function,
  };

  onChangeText = (text: string) => {
    this.setState({
      wipSearchString: text,
    });
  };

  onFinishTyping = (e: { nativeEvent: { text: string } }) => {
    this.setState({
      searchString: e.nativeEvent.text,
    });
  };

  selectUser = (userId: string) => {
    this.setState(prev => ({
      selectedUsers: prev.selectedUsers.concat([userId]),
      wipSearchString: '',
      searchString: '',
    }));
  };

  removeSelectedUser = (userId: string) => () => {
    this.setState(prev => ({
      selectedUsers: prev.selectedUsers.filter(
        selectedId => selectedId !== userId
      ),
    }));
  };

  onSubmit = (text: string) => {};

  render() {
    return (
      <ComposerWrapper>
        <SearchInputArea>
          <SelectedUsers>
            {this.state.selectedUsers.map(userId => (
              <SelectedUser
                key={userId}
                id={userId}
                onPressHandler={this.removeSelectedUser(userId)}
              />
            ))}
          </SelectedUsers>
          <TextInput
            onChangeText={this.onChangeText}
            onEndEditing={this.onFinishTyping}
            onSubmitEditing={this.onFinishTyping}
            value={this.state.wipSearchString}
            returnKeyType="search"
            style={{ flex: 1 }}
          />
        </SearchInputArea>
        {!this.state.searchString ? (
          <FullscreenNullState
            title={'Send Direct Messages'}
            subtitle={
              'Direct messages are private conversations between you and anyone else, including groups. Search for a person above to get started.'
            }
            icon={'message-new'}
          />
        ) : (
          <PeopleSearchView
            onPress={this.selectUser}
            queryString={this.state.searchString}
          />
        )}
        <ChatInput onSubmit={this.onSubmit} />
      </ComposerWrapper>
    );
  }
}

export default DirectMessageComposer;
