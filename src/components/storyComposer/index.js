// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import renderComponent from 'recompose/renderComponent';
// $FlowFixMe
import branch from 'recompose/branch';
// $FlowFixMe
import Textarea from 'react-textarea-autosize';
// $FlowFixMe
import { withRouter } from 'react-router';
import { TextButton } from '../buttons';
import Icon from '../icons';
import { LoadingCard } from '../loading';
import { getComposerCommunitiesAndFrequencies } from './queries';
import { publishStory } from './mutations';
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
  // prop types
  state: {
    isOpen: boolean,
    title: string,
    description: string,
    availableCommunities: Array<any>,
    availableFrequencies: Array<any>,
    activeCommunity: string,
    activeFrequency: string,
    isPublishing: boolean,
  };

  constructor(props) {
    super(props);

    /*
      Create a new array of communities only containing the `node` data from
      graphQL. Then filter the resulting frequency to remove any communities
      that don't have any frequencies yet

      TODO: Ideally we don't have any communities with no frequency. If we
      can guarantee this, we can remove the extra filter here
    */
    const availableCommunities = props.data.user.communityConnection.edges
      .map(edge => edge.node)
      .filter(community => community.frequencyConnection.edges.length > 0);

    /*
      Iterate through each of our community nodes to construct a new array
      of possible frequencies

      returns an array of array, where each parent array represents a community
      and each child array represents the frequencies within that parent
      community
    */
    const availableFrequencies = availableCommunities.map(community => {
      const arr = [];
      community.frequencyConnection.edges.map(edge => arr.push(edge.node));
      return arr;
    });

    /*
      If a user is viewing a communit or frequency, we use the url as a prop
      to set a default activeCommunity and activeFrequency

      If no defaults are set, we use the first available community, and then
      find the first available frequency within that available community
    */
    const activeCommunity = props.activeCommunity
      ? availableCommunities.filter(community => {
          return community.slug === props.activeCommunity;
        })[0].id
      : availableCommunities[0].id;
    const activeFrequency = props.activeFrequency
      ? availableFrequencies
          .filter(
            // get the frequencies for the proper community
            frequencies => frequencies[0].community.id === activeCommunity
          )
          .map(frequencies =>
            // get the correct frequency based on the slug
            frequencies.find(
              frequency => frequency.slug === props.activeFrequency
            )
          )[0].id
      : availableFrequencies.filter(
          // get the frequencies for the proper community
          frequencies => frequencies[0].community.id === activeCommunity
        )[0].id; // and select the first one in the list

    this.state = {
      isOpen: false,
      title: '',
      description: '',
      availableCommunities,
      availableFrequencies,
      activeCommunity,
      activeFrequency,
      isPublishing: false,
    };
  }

  changeTitle = e => {
    const title = e.target.value;
    this.setState({
      title,
    });
  };

  changeDescription = e => {
    const description = e.target.value;
    this.setState({
      description,
    });
  };

  handleOpenComposer = () => {
    // strange construction here in order to guarantee that we focus the title
    // input whenever the composer is opened
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
    const activeFrequency = e.target.value;

    this.setState({
      activeFrequency,
    });
  };

  publishStory = () => {
    // if no title and no frequency is set, don't allow a story to be published
    if (!this.state.title || !this.state.activeFrequency) {
      return;
    }

    // isPublishing will change the publish button to a loading spinner
    this.setState({
      isPublishing: true,
    });

    // define new constants in order to construct the proper shape of the
    // input for the publishStory mutation
    const { activeFrequency, activeCommunity, title, description } = this.state;
    const frequency = activeFrequency;
    const community = activeCommunity;
    const content = {
      title,
      description,
    };

    // this.props.mutate comes from a higher order component defined at the
    // bottom of this file
    this.props
      .mutate({
        variables: {
          story: {
            frequency,
            community,
            content,
          },
        },
      })
      // after the mutation occurs, it will either return an error or the new
      // story that was published
      .then(({ data }) => {
        // get the story id to redirect the user
        const id = data.publishStory.id;

        // stop the loading spinner on the publish button
        this.setState({
          isPublishing: false,
        });

        // redirect the user to the story
        this.props.history.push(`/story/${id}`);
      })
      .catch(error => {
        // TODO add some kind of dispatch here to show an error to the user
        console.log('error publishing story', error);
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
      isPublishing,
    } = this.state;

    return (
      <Container isOpen={isOpen}>
        <Overlay isOpen={isOpen} onClick={this.closeComposer} />
        <Composer isOpen={isOpen} onClick={this.handleOpenComposer}>

          <Placeholder isOpen={isOpen}>
            <Icon glyph="edit" />
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

              <TextButton
                onClick={this.publishStory}
                loading={isPublishing}
                disabled={!title || isPublishing}
              >
                Publish
              </TextButton>
            </Actions>
          </ContentContainer>

        </Composer>
      </Container>
    );
  }
}

export const StoryComposer = compose(
  getComposerCommunitiesAndFrequencies, // query to get data
  publishStory, // mutation to publish a story
  displayLoadingState, // handle loading state while query is fetching
  withRouter, // needed to use history.push() as a post-publish action
  pure
)(StoryComposerWithData);

export default StoryComposer;
