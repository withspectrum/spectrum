// @flow
import React, { Component } from 'react';
import Textarea from 'react-textarea-autosize';
import {
  Container,
  Composer,
  Overlay,
  Placeholder,
  PlaceholderLabel,
  StoryDescription,
  StoryTitle,
  ContentContainer,
} from './style';
import Icon from '../icons';

class StoryComposer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      title: '',
      description: '',
    };
  }

  changeTitle = e => {
    this.setState({
      title: e.target.value,
    });
  };

  changeDescription = e => {
    this.setState({
      description: e.target.value,
    });
  };

  handleOpenComposer = () => {
    const isOpen = this.state.isOpen;
    if (!isOpen) {
      this.setState({ isOpen: true });
      this.refs.titleTextarea.focus();
    }
  };

  closeComposer = () => {
    this.setState({
      isOpen: false,
    });
  };

  render() {
    const { isOpen } = this.state;

    return (
      <Container isOpen={isOpen}>
        <Overlay isOpen={isOpen} onClick={this.closeComposer} />
        <Composer isOpen={isOpen} onClick={this.handleOpenComposer}>

          <Placeholder isOpen={isOpen}>
            <Icon
              icon={'edit'}
              color={'text.alt'}
              hoverColor={'brand.default'}
              scaleOnHover={false}
            />
            <PlaceholderLabel>
              Start a new thread with your friends...
            </PlaceholderLabel>
          </Placeholder>

          <ContentContainer isOpen={isOpen}>
            <Textarea
              onChange={this.changeTitle}
              style={StoryTitle}
              value={this.state.title}
              placeholder={'Start a new thread with your friends...'}
              ref="titleTextarea"
              autoFocus
            />

            <Textarea
              onChange={this.changeDescription}
              value={this.state.description}
              style={StoryDescription}
              ref="descriptionTextarea"
              placeholder={
                'Write more thoughts here, add photos, and anything else!'
              }
            />
          </ContentContainer>

        </Composer>
      </Container>
    );
  }
}

export default StoryComposer;
