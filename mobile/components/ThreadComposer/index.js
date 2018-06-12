// @flow
import React, { Fragment } from 'react';
import { TextInput, Button } from 'react-native';
import Select from '../../components/Select';
import Wrapper, { InputWrapper } from './components/Wrapper';
import LocationPicker from './components/LocationPicker';
import { TitleTextInput, BodyTextInput } from './components/TextInputs';
import publishThread, {
  type PublishThreadProps,
  type PublishThreadResultType,
  type PublishThreadInput,
} from '../../../shared/graphql/mutations/thread/publishThread';
import type { TextInputProps } from 'react-native';
import type { NavigationProps } from 'react-navigation';

type Props = {|
  ...$Exact<PublishThreadProps>,
  ...$Exact<NavigationProps>,
|};

type SelectedState = {
  community: ?string,
  channel: ?string,
};

type State = {
  title: string,
  body: string,
  selected: SelectedState,
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

  onSelectedChange = (selected: SelectedState) => {
    this.setState({ selected });
  };

  focusBodyInput = () => {
    this.bodyInput && this.bodyInput.focus();
  };

  publish = () => {
    const { selected, title, body } = this.state;
    if (!selected.community || !selected.channel || !title) return;
    this.props
      .publishThread({
        channelId: selected.channel,
        communityId: selected.community,
        content: {
          title,
          body,
        },
        type: 'TEXT',
      })
      .then(result => {
        this.props.navigation.navigate('Thread', {
          id: result.data.publishThread.id,
        });
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    const { selected, title, body } = this.state;

    const canPublish =
      selected.community !== null && selected.channel !== null && title !== '';
    return (
      <Wrapper>
        <LocationPicker
          selected={selected}
          onSelectedChange={this.onSelectedChange}
        />
        <InputWrapper>
          <TitleTextInput
            onChangeText={this.onChangeText('title')}
            value={title}
            autoFocus
            placeholder="What's up?"
            // Called when "Return" is pressed
            onSubmitEditing={this.focusBodyInput}
          />
          <BodyTextInput
            innerRef={elem => (this.bodyInput = elem)}
            onChangeText={this.onChangeText('body')}
            value={body}
            multiline
            numberOfLines={5}
            placeholder="Write more thoughts here..."
          />
        </InputWrapper>
        <Button onPress={this.publish} title="Publish" disabled={!canPublish} />
      </Wrapper>
    );
  }
}

export default publishThread(ThreadComposer);
