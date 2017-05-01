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
import { LoadingCard } from '../loading';
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
  Dropdowns,
} from './style';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

class StoryComposerWithData extends Component {
  constructor(props) {
    super(props);

    const availableCommunities = props.data.user.communityConnection.edges
      .map(edge => edge.node)
      .filter(community => community.frequencyConnection.edges.length > 0);
    // filter to exclude communities with no frequencies

    const availableFrequencies = availableCommunities.map(community => {
      return community.frequencyConnection.edges.map(edge => edge.node);
    });

    const activeCommunity = props.activeCommunity || availableCommunities[0].id;
    const activeFrequency =
      props.activeFrequency ||
      availableFrequencies.filter(
        frequency => frequency[0].community.id === activeCommunity
      )[0][0].id;

    this.state = {
      isOpen: false,
      title: '',
      description: '',
      availableCommunities,
      availableFrequencies,
      activeCommunity,
      activeFrequency,
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

  setActiveCommunity = e => {
    const newActiveCommunity = e.target.value;
    const newActiveFrequency = this.state.availableFrequencies.filter(
      frequency => frequency[0].community.id === newActiveCommunity
    )[0][0].id;

    this.setState({
      activeCommunity: newActiveCommunity,
      activeFrequency: newActiveFrequency,
    });
  };

  setActiveFrequency = e => {
    this.setState({
      activeFrequency: e.target.value,
    });
  };

  render() {
    const {
      isOpen,
      title,
      availableFrequencies,
      availableCommunities,
      activeCommunity,
      activeFrequency,
    } = this.state;

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
              placeholder={'A title for your thread...'}
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
              <Dropdowns>
                <select
                  onChange={this.setActiveCommunity}
                  defaultValue={activeCommunity}
                >
                  {availableCommunities.map(community => {
                    return (
                      <option key={community.id} value={community.id}>
                        {community.name}
                      </option>
                    );
                  })}
                </select>

                <select
                  onChange={this.setActiveFrequency}
                  defaultValue={activeFrequency}
                >
                  {availableFrequencies
                    .filter(
                      frequency => frequency[0].community.id === activeCommunity
                    )
                    .map((frequency, i) => {
                      return frequency.map(e => {
                        return (
                          <option key={e.id} value={e.id}>{e.name}</option>
                        );
                      });
                    })}
                </select>
              </Dropdowns>

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
