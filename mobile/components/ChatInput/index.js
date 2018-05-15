// @flow
import React from 'react';
import { TextInput, View, Button } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import {
  ChatInputWrapper,
  ChatInputTextInputWrapper,
  SendButton,
} from './style';

type Props = {
  onSubmit: (text: string) => void,
};

type State = {
  value: string,
};

class ChatInput extends React.Component<Props, State> {
  state = {
    value: '',
  };

  onChangeText = (value: string) => {
    this.setState({ value });
  };

  submit = () => {
    this.props.onSubmit(this.state.value);
    this.onChangeText('');
  };

  render() {
    return (
      <View style={{ width: '100%' }}>
        <ChatInputWrapper>
          <ChatInputTextInputWrapper>
            <TextInput
              value={this.state.value}
              onChangeText={this.onChangeText}
              placeholder="Your message here..."
              multiline
              autoFocus
              disableFullscreenUI
              onSubmitEditing={this.submit}
            />
          </ChatInputTextInputWrapper>
          <SendButton onPress={this.submit} size={32} />
        </ChatInputWrapper>
        {/* NOTE(@mxstbr): Magic number, otherwise the chatinput is way above the keyboard */}
        <KeyboardSpacer topSpacing={-75} />
      </View>
    );
  }
}

export default ChatInput;
