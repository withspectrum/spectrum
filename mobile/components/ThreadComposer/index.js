// @flow
import * as React from 'react';
import { Alert } from 'react-native';
import compose from 'recompose/compose';
import Wrapper, { InputWrapper } from './components/Wrapper';
import LocationPicker from './components/LocationPicker';
import { TitleTextInput, BodyTextInput } from './components/TextInputs';
import publishThread, {
  type PublishThreadProps,
} from '../../../shared/graphql/mutations/thread/publishThread';
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
  componentDidMount() {
    this.props.navigation.setParams({ onPublish: this.publish });
    this.props.navigation.setParams({
      onThreadComposerCancel: this.onThreadComposerCancel,
    });
  }

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

  setPublishDisabledState = () => {
    const { selected, title } = this.state;
    if (!selected.community || !selected.channel || !title)
      return this.props.navigation.setParams({ publishDisabled: true });
    this.props.navigation.setParams({ publishDisabled: false });
  };

  onChangeText = (field: 'title' | 'body') => (text: string) => {
    this.setState(
      {
        [field]: text,
      },
      () => this.setPublishDisabledState()
    );
  };

  onSelectedChange = (selected: SelectedState) => {
    this.setState({ selected }, () => this.setPublishDisabledState());
  };

  onThreadComposerCancel = () => {
    const { navigation } = this.props;
    const { title, body } = this.state;
    if ((title && title.length > 0) || (body && body.length > 0)) {
      return Alert.alert(
        'Delete thread draft?',
        'Your current draft will not be saved',
        [
          { text: 'Keep editing', onPress: () => {}, style: 'cancel' },
          {
            text: 'Delete draft',
            onPress: () => navigation.goBack(),
            style: 'destructive',
          },
        ]
      );
    }

    return navigation.goBack();
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
      </Wrapper>
    );
  }
}

export default compose(publishThread)(ThreadComposer);
