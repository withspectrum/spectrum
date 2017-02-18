import React, { Component } from 'react';
import { connect } from 'react-redux';
import StoryDetail from '../StoryDetail';
import ChatInput from '../ChatInput';
// eslint-disable-next-line
import ComposerNew from '../ComposerNew';
import actions from '../../../actions';
import helpers from '../../../helpers';

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
    this.props.dispatch(actions.deleteStory(story.id));
  };

  toggleLockedStory = () => {
    const story = this.getActiveStory();
    this.props.dispatch(actions.toggleLockedStory(story));
  };

  showGallery = e => {
    let arr = [];
    arr.push(e.target.src);
    this.props.dispatch(actions.showGallery(arr));
  };

  render() {
    let { composer, user, frequencies } = this.props
    let story = this.getActiveStory();
    
    let moderator, creator, locked;
    if (story) {
      creator = helpers.isStoryCreator(story, user);
      moderator = helpers.getStoryPermission(
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
            <ComposerNew />
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
