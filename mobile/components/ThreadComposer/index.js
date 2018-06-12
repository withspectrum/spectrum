// @flow
import React, { Fragment } from 'react';
import { TextInput, Button } from 'react-native';
import Select from '../../components/Select';
import Wrapper, { InputWrapper } from './components/Wrapper';
import { TitleTextInput, BodyTextInput } from './components/TextInputs';
import type { TextInputProps } from 'react-native';

type Props = {||};

type State = {
  title: string,
  body: string,
  selected: {
    community: ?string,
    channel: ?string,
  },
};

class ThreadComposer extends React.Component<Props, State> {
  bodyInput: ?{
    focus: Function,
    clear: Function,
  };

  state = {
    title: '',
    body: '',
    selected: {
      community: null,
      channel: null,
    },
  };

  onChangeText = (field: 'title' | 'body') => (text: string) => {
    this.setState({
      [field]: text,
    });
  };

  onValueChange = (field: 'channel' | 'community') => (value: string) => {
    this.setState(prev => ({
      selected: {
        ...prev.selected,
        [field]: value,
      },
    }));
  };

  focusBodyInput = () => {
    this.bodyInput && this.bodyInput.focus();
  };

  render() {
    const { selected } = this.state;
    return (
      <Wrapper>
        <Select
          placeholder={{ label: 'Select a community', value: null }}
          items={[
            { label: 'First community', value: 'first' },
            { label: 'Second community', value: 'second' },
          ]}
          value={selected.community}
          onValueChange={this.onValueChange('community')}
        />
        <Select
          placeholder={{ label: 'Select a channel', value: null }}
          items={[
            { label: 'First channel', value: 'first' },
            { label: 'Second channel', value: 'second' },
          ]}
          value={selected.channel}
          onValueChange={this.onValueChange('channel')}
        />
        <InputWrapper>
          <TitleTextInput
            onChangeText={this.onChangeText('title')}
            value={this.state.title}
            autoFocus
            placeholder="What's up?"
            // Called when "Return" is pressed
            onSubmitEditing={this.focusBodyInput}
          />
          <BodyTextInput
            innerRef={elem => (this.bodyInput = elem)}
            onChangeText={this.onChangeText('body')}
            value={this.state.body}
            multiline
            numberOfLines={5}
            placeholder="Write more thoughts here..."
          />
        </InputWrapper>
        <Button onPress={() => null} title="Publish" />
      </Wrapper>
    );
  }
}

export default ThreadComposer;
