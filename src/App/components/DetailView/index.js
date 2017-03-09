import React, { Component } from 'react';
import { connect } from 'react-redux';
import StoryDetail from '../StoryDetail';
import ChatInput from '../ChatInput';
// eslint-disable-next-line
import Composer from '../Composer';
import { deleteStory, toggleLockedStory } from '../../../actions/stories';
import { openGallery } from '../../../actions/gallery';
import { isStoryCreator, getStoryPermission } from '../../../helpers/stories';
import { LoginButton, LoginText } from '../StoryMaster/style';
import { login } from '../../../actions/user';

import {
  ViewContainer,
  LogicContainer,
  NullContainer,
  NullText,
  Footer,
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

  openGallery = e => {
    let arr = [];
    arr.push(e.target.src);
    this.props.dispatch(openGallery(arr));
  };

  login = () => {
    this.props.dispatch(login());
  };

  render() {
    let { composer, user, frequencies } = this.props;
    let story = this.getActiveStory();

    let moderator, creator, locked;
    if (story) {
      creator = isStoryCreator(story, user);
      moderator = getStoryPermission(story, user, frequencies);
      locked = story.locked ? story.locked : false;
    }

    if (story && !composer.isOpen) {
      // if we're viewing a story and the composer is not open
      return (
        <ViewContainer
          mobile={this.props.stories.active || this.props.composer.isOpen}
        >
          <LogicContainer>
            <StoryDetail
              activeStory={story}
              creator={creator}
              moderator={moderator}
              locked={locked}
            />
            {!story.locked &&
              <Footer centered={!user.uid}>
                {user.uid
                  ? <ChatInput />
                  : <LoginButton onClick={this.login}>
                      Sign in with Twitter to chat
                    </LoginButton>}
              </Footer>}
          </LogicContainer>
        </ViewContainer>
      );
    } else if (composer.isOpen) {
      // otherwise if the composer is open
      return (
        <ViewContainer
          mobile={this.props.stories.active || this.props.composer.isOpen}
        >
          <LogicContainer>
            <Composer />
          </LogicContainer>
        </ViewContainer>
      );
    } else {
      // otherwise show a null state
      return (
        <ViewContainer
          mobile={this.props.stories.active || this.props.composer.isOpen}
        >
          <NullContainer>
            <NullText>Choose a story to get started!</NullText>
          </NullContainer>
        </ViewContainer>
      );
    }
  }
}

const mapStateToProps = state => ({
  stories: state.stories,
  frequencies: state.frequencies,
  user: state.user,
  composer: state.composer,
});

export default connect(mapStateToProps)(DetailView);
