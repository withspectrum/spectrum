import React, { Component } from 'react';
import { connect } from 'react-redux';
import StoryDetail from '../StoryDetail';
import ChatInput from '../ChatInput';
// eslint-disable-next-line
import Composer from '../Composer';
import { subscribeFrequency } from '../../../actions/frequencies';
import { deleteStory, toggleLockedStory } from '../../../actions/stories';
import { openGallery } from '../../../actions/gallery';
import { isStoryCreator, getStoryPermission } from '../../../helpers/stories';
import { LoginButton, LoginText } from '../StoryMaster/style';
import { login } from '../../../actions/user';
import history from '../../../helpers/history';

import {
  ViewContainer,
  LogicContainer,
  NullContainer,
  NullText,
  Footer,
} from './style';

class DetailView extends Component {
  getActiveStory = () => {
    const { stories: { stories, active } } = this.props;
    if (!stories || stories.length === 0) return;

    return stories.find(story => story.id === active);
  };

  subscribeFrequency = () => {
    this.props.dispatch(
      subscribeFrequency(this.props.frequencies.active, false),
    );
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
    const { composer, user, frequencies: { frequencies, active } } = this.props;
    let story = this.getActiveStory();

    let role, creator, locked;
    if (story) {
      if (story.deleted) {
        history.push(`/~${active || 'everything'}`);
        story = null;
      }
      creator = isStoryCreator(story, user);
      role = getStoryPermission(story, user, frequencies);
      locked = story.locked ? story.locked : false;
    }

    if (story && !composer.isOpen) {
      // if we're viewing a story and the composer is not open
      return (
        <ViewContainer>
          <LogicContainer>
            <StoryDetail
              activeStory={story}
              creator={creator}
              moderator={role}
              locked={locked}
            />
            {!story.locked &&
              <Footer centered={!role}>
                {user.uid && role && <ChatInput />}

                {!user.uid &&
                  <LoginButton onClick={this.login}>
                    Sign in with Twitter to chat
                  </LoginButton>}

                {user.uid &&
                  !role &&
                  <LoginButton onClick={this.subscribeFrequency}>
                    Join ~{this.props.frequencies.active} to chat!
                  </LoginButton>}
              </Footer>}
          </LogicContainer>
        </ViewContainer>
      );
    } else if (composer.isOpen) {
      // otherwise if the composer is open
      return (
        <ViewContainer>
          <LogicContainer>
            <Composer />
          </LogicContainer>
        </ViewContainer>
      );
    } else {
      // otherwise show a null state
      return (
        <ViewContainer>
          <NullContainer />
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
