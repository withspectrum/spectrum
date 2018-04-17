// @flow
import React from 'react';
import { TextInput, View, Button } from 'react-native';

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
          autoFocus
          disableFullscreenUI
          onSubmitEditing={this.submit}
        />
        <Button onPress={this.submit} title="Send" />
      </View>
    );
  }
}

export default ChatInput;
