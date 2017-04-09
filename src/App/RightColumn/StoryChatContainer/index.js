//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';
import deepEqual from 'deep-eql';
import { sortAndGroupBubbles } from '../../../helpers/utils';
import StoryComposer from './StoryComposer';
import StoryChat from './StoryChat';
import EmptyContainerIllustration
  from '../../Components/EmptyContainerIllustration';

type StoryChatContainerProps = {
  storyComposer: Object,
  communities: Array<Object>,
  frequencies: Array<Object>,
  stories: Array<Object>,
  activeCommunity: string,
  activeFrequency: string,
  activeStory: string,
  messages: Array<?Array<Object>>,
};
class StoryChatContainer extends Component {
  props: StoryChatContainerProps;

  shouldComponentUpdate(nextProps: Object) {
    return !deepEqual(nextProps, this.props);
  }

  getActiveStory() {
    const { stories, activeStory } = this.props;
    return stories.find(story => story.id === activeStory);
  }

  getActiveFrequency(story) {
    const { frequencies } = this.props;
    if (!story) return;
    return frequencies.find(frequency => frequency.id === story.frequencyId);
  }

  getActiveCommunity() {
    const { communities, activeCommunity } = this.props;
    return communities.find(community => community.slug === activeCommunity);
  }

  render() {
    const { storyComposer, messages } = this.props;
    const activeStory = this.getActiveStory();
    const activeFrequency = this.getActiveFrequency(activeStory);
    const activeCommunity = this.getActiveCommunity();

    if (storyComposer.isOpen) {
      return <StoryComposer community={activeCommunity} />;
    } else if (activeStory) {
      return (
        <StoryChat
          story={activeStory}
          frequency={activeFrequency}
          community={activeCommunity}
          messages={messages}
        />
      );
    } else {
      return <EmptyContainerIllustration />;
    }
  }
}

const mapStateToProps = state => {
  const messages = state.messages.messages.filter(
    message => message.storyId === state.stories.active,
  );

  return {
    storyComposer: state.composer,
    activeCommunity: state.communities.active,
    activeFrequency: state.frequencies.active,
    activeStory: state.stories.active,
    communities: state.communities.communities,
    frequencies: state.frequencies.frequencies,
    stories: state.stories.stories,
    messages: sortAndGroupBubbles(messages),
  };
};
export default connect(mapStateToProps)(StoryChatContainer);
