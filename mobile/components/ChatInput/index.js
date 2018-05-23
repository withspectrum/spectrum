// @flow
import React from 'react';
import { TextInput, View, Button } from 'react-native';
import KeyboardSpacer from 'react-native-keyboard-spacer';

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
      <View>
        <TextInput
          value={this.state.value}
          onChangeText={this.onChangeText}
          placeholder="Your message here..."
          multiline
          autoFocus={false}
          disableFullscreenUI
          onSubmitEditing={this.submit}
        />
        <Button onPress={this.submit} title="Send" />
        {/* NOTE(@mxstbr): Magic number, otherwise the chatinput is way above the keyboard */}
        <KeyboardSpacer topSpacing={-75} />
      </View>
    );
  }
}

export default ChatInput;
