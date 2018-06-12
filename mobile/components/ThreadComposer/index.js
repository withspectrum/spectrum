// @flow
import React, { Fragment } from 'react';
import { TextInput, Button, Picker } from 'react-native';
import Wrapper from './components/Wrapper';

type Props = {||};

class ThreadComposer extends React.Component<Props> {
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
        <TextInput autoFocus placeholder="What's up?" />
        <TextInput multiline placeholder="Write more thoughts here..." />
        <Button onPress={() => null} title="Publish" />
      </Wrapper>
    );
  }
}

export default ThreadComposer;
