// @flow
import React from 'react';
import { TextInput } from 'react-native';
import Text from '../../components/Text';
import ChatInput from '../../components/ChatInput';
import { FullscreenNullState } from '../../components/NullStates';
import PeopleSearchView from '../Search/PeopleSearchView';
import { SearchView } from '../Search/style';
import styled from 'styled-components/native';
import type { NavigationProps } from 'react-navigation';

const ComposerWrapper = styled.View`
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  background-color: ${props => props.theme.bg.wash};
`;

type Props = {
  ...$Exact<NavigationProps>,
};

type State = {
  searchString: string,
};

class DirectMessageComposer extends React.Component<Props, State> {
  state = {
    searchString: '',
  };

  onFinishTyping = (e: { nativeEvent: { text: string } }) => {
    this.setState({
      searchString: e.nativeEvent.text,
    });
  };

  onSubmit = (text: string) => {};

  render() {
    return (
      <ComposerWrapper>
        <TextInput
          onEndEditing={this.onFinishTyping}
          onSubmitEditing={this.onFinishTyping}
          returnKeyType="search"
        />
        {!this.state.searchString ? (
          <SearchView>
            <FullscreenNullState
              title={'Search for people'}
              subtitle={'Connect with people on Spectrum'}
              icon={'person'}
            />
          </SearchView>
        ) : (
          <PeopleSearchView
            navigation={this.props.navigation}
            queryString={this.state.searchString}
          />
        )}
        <ChatInput onSubmit={this.onSubmit} />
      </ComposerWrapper>
    );
  }
}

export default DirectMessageComposer;
