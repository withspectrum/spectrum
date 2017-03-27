import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { subscribeFrequency } from '../../actions/frequencies';
import { isStoryCreator, getStoryPermission } from '../../helpers/stories';
import { getCurrentFrequency } from '../../helpers/frequencies';
import { throttle } from '../../helpers/utils';
import { LoginButton } from '../MiddleColumn/style';
import { login } from '../../actions/user';
import history from '../../helpers/history';
import Icon from '../../shared/Icons';
import { Button, H4 } from '../../shared/Globals';

import Story from './Story';
import ActionBar from './Story/ActionBar';
import Chat from './Chat';
import MessageGroupHeader from './MessageGroupHeader';
import ChatInput from './ChatInput';
import Composer from './Composer';

import {
  ViewContainer,
  NullContainer,
  Footer,
  StoryChatContainer,
  BackArrow,
  LoginWrapper,
} from './style';

class RightColumn extends Component {
  constructor() {
    super();

    this.onScroll = throttle(this.onScroll, 500);

    this.state = {
      atBottom: false,
    };
  }

  componentDidMount = () => {
    if (!this.comp) return;
    let node = this.comp;
    if (node.scrollHeight - node.clientHeight < node.scrollTop + 140) {
      this.setState({
        atBottom: true,
      });
    } else {
      this.setState({
        atBottom: false,
      });
    }
  };

  getActiveStory = () => {
    const { stories: { stories, active } } = this.props;
    if (!stories || stories.length === 0) return;

    return stories.find(story => story.id === active);
  };

  getActiveMessageGroup = () => {
    const { messageGroups: { messageGroups, active } } = this.props;
    if (!messageGroups || messageGroups.length === 0) return;

    return messageGroups.find(group => group.id === active);
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

  onScroll = () => {
    if (!this.comp) return;
    let node = this.comp;
    if (node.scrollHeight - node.clientHeight < node.scrollTop + 140) {
      this.setState({
        atBottom: true,
      });
    } else {
      this.setState({
        atBottom: false,
      });
    }
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

    if (active === 'messages') {
      let messageGroup = this.getActiveMessageGroup();
      if (messageGroup) {
        return (
          <ViewContainer>
            <Link to={`/messages`}>
              <BackArrow onClick={this.clearActiveStory}>
                <Icon icon="back" />
              </BackArrow>
            </Link>

            <StoryChatContainer
              innerRef={comp => this.comp = comp}
              onScroll={this.onScroll}
            >
              <MessageGroupHeader messageGroup={messageGroup} />
              <Chat
                atBottom={this.state.atBottom}
                forceScrollToBottom={this.forceScrollToBottom}
                contextualScrollToBottom={this.contextualScrollToBottom}
                messageGroup={messageGroup}
              />
            </StoryChatContainer>

            <Footer>
              {user.uid &&
                <ChatInput forceScrollToBottom={this.forceScrollToBottom} />}
            </Footer>
          </ViewContainer>
        );
      }
    }

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
            onScroll={this.onScroll}
          >
            <Story story={story} frequency={currentFrequency} active={active} />
            <ActionBar
              locked={locked}
              moderator={role}
              creator={creator}
              story={story}
            />
            <Chat
              atBottom={this.state.atBottom}
              forceScrollToBottom={this.forceScrollToBottom}
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
                <LoginWrapper center>
                  <H4>Feel like weighing in?</H4>
                  <Button onClick={this.login}>Sign in with Twitter</Button>
                </LoginWrapper>}

              {user.uid &&
                !role &&
                <LoginWrapper center>
                  <H4>Feel like weighing in?</H4>
                  <Button onClick={this.subscribeFrequency}>
                    Join ~{this.props.frequencies.active}
                  </Button>
                </LoginWrapper>}
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
  messageGroups: state.messageGroups,
});

export default connect(mapStateToProps)(RightColumn);
