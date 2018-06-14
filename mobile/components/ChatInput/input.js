// @flow
import React from 'react';
import { TextInput, View } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { ChatInputWrapper, ChatInputTextInputWrapper } from './style';
import Icon from '../Icon';

import type { Node } from 'react';

export type InputProps = {
  onSubmit: (text: string) => void,
  children?: Node,
  disableSubmit?: boolean,
};

type State = {
  value: string,
};

class ChatInput extends React.Component<InputProps, State> {
  state = {
    value: '',
  };

  onChangeText = (value: string) => {
    this.setState({ value });
  };

  submit = () => {
    const { disableSubmit = false } = this.props;
    if (disableSubmit) return;
    this.props.onSubmit(this.state.value);
    this.onChangeText('');
  };

  render() {
    return (
      <View style={{ width: '100%' }}>
        <ChatInputWrapper>
          <ChatInputTextInputWrapper>
            {this.props.children}
            <TextInput
              value={this.state.value}
              onChangeText={this.onChangeText}
              placeholder="Your message here..."
              multiline
              autoFocus={false}
              disableFullscreenUI
              onSubmitEditing={this.submit}
            />
          </ChatInputTextInputWrapper>
          <Icon glyph={'send-fill'} onPress={this.submit} size={32} />
        </ChatInputWrapper>
        {/* NOTE(@mxstbr): Magic number, otherwise the chatinput is way above the keyboard */}
        <KeyboardSpacer topSpacing={-75} />
      </View>
    );
  }
}

export default ChatInput;
