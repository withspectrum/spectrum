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
} from './style';
import Icon from '../icons';

class StoryComposer extends Component {
  constructor({ location }) {
    super({ location });

    this.state = {
      isOpen: false,
      title: null,
      description: null,
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
    isOpen ? '' : this.setState({ isOpen: true });
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

          {!isOpen &&
            <Placeholder>
              <Icon
                icon={'edit'}
                color={'text.alt'}
                hoverColor={'brand.default'}
                scaleOnHover={false}
              />
              <PlaceholderLabel>
                Start a new thread with your friends...
              </PlaceholderLabel>
            </Placeholder>}

          {isOpen &&
            <div>
              <Textarea
                onChange={this.changeTitle}
                style={StoryTitle}
                value={this.state.title}
                placeholder={'Start a new thread with your friends...'}
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
            </div>}

        </Composer>
      </Container>
    );
  }
}

export default StoryComposer;
