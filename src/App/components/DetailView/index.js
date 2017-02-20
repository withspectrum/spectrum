import React, { Component } from 'react';
import { connect } from 'react-redux';
import StoryDetail from '../StoryDetail';
import ChatInput from '../ChatInput';
// eslint-disable-next-line
import Composer from '../Composer';
import {
  deleteStory,
  toggleLockedStory
} from '../../../actions/stories';
import { showGallery } from '../../../actions/gallery';
import { isStoryCreator, getStoryPermission } from '../../../helpers/stories';

import {
  ViewContainer,
  LogicContainer,
  NullContainer,
  NullText,
} from './style';

class DetailView extends Component {
  getActiveStory = () => {
    if (this.props.stories.stories) {
      return this.props.stories.stories.filter(story => {
        return story.id === this.props.stories.active;
      })[0] ||
        '';
    } else {
      return;
    }
  };

  deleteStory = () => {
    const story = this.getActiveStory();
    this.props.dispatch(deleteStory(story.id));
  };

  toggleLockedStory = () => {
    const story = this.getActiveStory();
    this.props.dispatch(toggleLockedStory(story));
  };

  showGallery = e => {
    let arr = [];
    arr.push(e.target.src);
    this.props.dispatch(showGallery(arr));
  };

  render() {
    let { composer, user, frequencies } = this.props
    let story = this.getActiveStory();

    let moderator, creator, locked;
    if (story) {
      creator = isStoryCreator(story, user);
      moderator = getStoryPermission(
        story,
        user,
        frequencies,
      );
      locked = story.locked ? story.locked : false;
    }

    if (story && !composer.isOpen) { // if we're viewing a story and the composer is not open
      return (
        <ViewContainer>
          <LogicContainer>
            <StoryDetail
              activeStory={story}
              creator={creator}
              moderator={moderator}
              locked={locked}
            />
            {!story.locked && <ChatInput />}
          </LogicContainer>
        </ViewContainer>
      );
    } else if (composer.isOpen) { // otherwise if the composer is open
      return (
        <ViewContainer>
          <LogicContainer>
            <Composer />
          </LogicContainer>
        </ViewContainer>
      )
    } else { // otherwise show a null state
      return (
        <ViewContainer>
          <NullContainer>
            <NullText>Choose a story to get started!</NullText>
          </NullContainer>
        </ViewContainer>
      )
    }
  }
}

const mapStateToProps = state => ({
  stories: state.stories,
  frequencies: state.frequencies,
  user: state.user,
  composer: state.composer
});

export default connect(mapStateToProps)(DetailView);
