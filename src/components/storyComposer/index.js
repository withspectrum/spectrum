// @flow
import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
//$FlowFixMe
import branch from 'recompose/branch';
import Textarea from 'react-textarea-autosize';
import { LinkButton } from '../buttons';
import Icon from '../icons';
import Loading from '../loading';
import { getComposerCommunitiesAndFrequencies } from './queries';
import {
  Container,
  Composer,
  Overlay,
  Placeholder,
  PlaceholderLabel,
  StoryDescription,
  StoryTitle,
  ContentContainer,
  Actions,
} from './style';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(Loading)
);

class StoryComposerWithData extends Component {
  constructor(props) {
    super(props);

    const communities = props.data.user.communityConnection.edges.map(edge => {
      return edge.node;
    });

    const frequencies = communities.map(community => {
      if (community.frequencyConnection.edges.length === 0) return;

      return community.frequencyConnection.edges.map(edge => {
        return edge.node;
      });
    });

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
    const { isOpen, title, description } = this.state;

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
              placeholder={"What's this thread about?"}
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

            <Actions>
              <div />
              <div>
                <LinkButton disabled={!title}>Publish</LinkButton>
              </div>
            </Actions>
          </ContentContainer>

        </Composer>
      </Container>
    );
  }
}

export const StoryComposer = compose(
  getComposerCommunitiesAndFrequencies,
  displayLoadingState,
  pure
)(StoryComposerWithData);
export default StoryComposer;
