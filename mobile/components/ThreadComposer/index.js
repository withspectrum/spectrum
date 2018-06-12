// @flow
import React, { Fragment } from 'react';
import { TextInput, Button, Picker } from 'react-native';
import Wrapper from './components/Wrapper';

type Props = {||};

type State = {
  title: string,
  body: string,
};

class ThreadComposer extends React.Component<Props, State> {
  bodyInput: ?{
    focus: Function,
    clear: Function,
  };

  state = {
    title: '',
    body: '',
  };

  onChangeText = (field: 'title' | 'body') => (text: string) => {
    this.setState({
      [field]: text,
    });
  };

  focusBodyInput = () => {
    this.bodyInput && this.bodyInput.focus();
  };

  render() {
    return (
      <Wrapper>
        <Picker selectedValue="first">
          <Picker.Item label="First community" value="first" />
          <Picker.Item label="Second community" value="second" />
        </Picker>
        <Picker selectedValue="first">
          <Picker.Item label="First channel" value="first" />
          <Picker.Item label="Second channel" value="second" />
        </Picker>
        <TextInput
          onChangeText={this.onChangeText('title')}
          value={this.state.title}
          autoFocus
          placeholder="What's up?"
          // Called when "Return" is pressed
          onSubmitEditing={this.focusBodyInput}
        />
        <TextInput
          ref={elem => (this.bodyInput = elem)}
          onChangeText={this.onChangeText('body')}
          value={this.state.body}
          multiline
          numberOfLines={5}
          placeholder="Write more thoughts here..."
        />
        <Button onPress={() => null} title="Publish" />
      </Wrapper>
    );
  }
}

export default ThreadComposer;
