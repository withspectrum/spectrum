import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { subscribeFrequency } from '../../../actions/frequencies';
import { deleteStory, toggleLockedStory } from '../../../actions/stories';
import { isStoryCreator, getStoryPermission } from '../../../helpers/stories';
import { getCurrentFrequency } from '../../../helpers/frequencies';
import { LoginButton, LoginText } from '../StoryMaster/style';
import { login } from '../../../actions/user';
import history from '../../../helpers/history';
import Icon from '../../../shared/Icons';

import StoryDetail from './StoryDetail';
import StoryActions from './StoryActions';
import ChatDetail from './ChatDetail';
import ChatInput from './ChatInput';
import Composer from './Composer';

import {
  ViewContainer,
  NullContainer,
  Footer,
  StoryChatContainer,
  BackArrow,
} from './style';

class RightColumn extends Component {
  getActiveStory = () => {
    const { stories: { stories, active } } = this.props;
    if (!stories || stories.length === 0) return;

    return stories.find(story => story.id === active);
  };

  // if the user is at the bottom of the chat view and another user sends a message, scroll the view
  contextualScrollToBottom = () => {
    if (!this.comp) return;
    let node = this.comp;
    if (node.scrollHeight - node.clientHeight < node.scrollTop + 140) {
      node.scrollTop = node.scrollHeight - node.clientHeight;
    }
  };

  // if the current user sends a message, scroll the view
  forceScrollToBottom = () => {
    if (!this.comp) return;
    let node = this.comp;

    node.scrollTop = node.scrollHeight - node.clientHeight;
  };

  subscribeFrequency = () => {
    this.props.dispatch(
      subscribeFrequency(this.props.frequencies.active, false),
    );
  };

  login = () => {
    this.props.dispatch(login());
  };

  // used on mobile when closing the story view
  clearActiveStory = () => {
    this.props.dispatch({
      type: 'CLEAR_ACTIVE_STORY',
    });
  };

  render() {
    const { composer, user, frequencies: { frequencies, active } } = this.props;
    let story = this.getActiveStory();

    let role, creator, locked, currentFrequency, returnUrl;
    if (story) {
      if (story.deleted) {
        // a user has landed on an old url, boot them back to the story's frequency or everything
        history.push(`/~${active || 'everything'}`);
        story = null;
      }

      creator = isStoryCreator(story, user);
      role = getStoryPermission(story, user, frequencies);
      locked = story.locked ? story.locked : false;

      currentFrequency = getCurrentFrequency(story.frequencyId, frequencies);

      returnUrl = active === 'everything'
        ? 'everything'
        : currentFrequency && currentFrequency.slug;
    }

    if (story && !composer.isOpen) {
      return (
        <ViewContainer>
          <Link to={`/~${returnUrl}`}>
            <BackArrow onClick={this.clearActiveStory}>
              <Icon icon="back" />
            </BackArrow>
          </Link>

          <StoryChatContainer
            innerRef={comp => this.comp = comp}
            locked={story.locked}
          >
            <StoryDetail
              story={story}
              frequency={currentFrequency}
              active={active}
            />
            <StoryActions
              locked={locked}
              moderator={role}
              creator={creator}
              story={story}
            />
            <ChatDetail
              contextualScrollToBottom={this.contextualScrollToBottom}
              story={story}
            />
          </StoryChatContainer>

          {!story.locked &&
            <Footer centered={!role}>
              {user.uid &&
                role &&
                <ChatInput forceScrollToBottom={this.forceScrollToBottom} />}

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

        </ViewContainer>
      );
    } else if (composer.isOpen) {
      return (
        <ViewContainer>
          <Composer />
        </ViewContainer>
      );
    } else {
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

export default connect(mapStateToProps)(RightColumn);
