import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import { subscribeFrequency } from '../../actions/frequencies';
import { isStoryCreator, getStoryPermission } from '../../helpers/stories';
import { getCurrentFrequency } from '../../helpers/frequencies';
import { throttle } from '../../helpers/utils';
import { login } from '../../actions/user';
import history from '../../helpers/history';
import Icon from '../../shared/Icons';
import { Button, H4 } from '../../shared/Globals';

import Story from './Story';
import ActionBar from './Story/ActionBar';
import Chat from './Chat';
import ChatInput from './ChatInput';
import Composer from './Composer';
import Explore from './Explore';

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
      subscribeFrequency(
        {
          frequencySlug: this.props.frequencies.active,
          communitySlug: this.props.communities.active,
        },
        false,
      ),
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
    const {
      composer,
      user,
      frequencies: { frequencies, active },
      communities,
    } = this.props;
    let story = this.getActiveStory();

    const communitySlug = communities.active;
    let role, creator, locked, storyFrequency, returnUrl;
    if (story !== undefined) {
      if (story.deleted) {
        // a user has landed on an old url, boot them back to the story's community or everything
        history.push(`/${`${communitySlug}/${active}` || 'everything'}`);
        story = null;
      }

      creator = isStoryCreator(story, user);
      role = getStoryPermission(story, user, frequencies);
      locked = story && story.locked ? story.locked : false;

      const community = communities.communities.find(
        community => community.slug === communitySlug,
      );
      storyFrequency = story &&
        getCurrentFrequency(story.frequencyId, frequencies, community.id);

      returnUrl = communitySlug === 'everything'
        ? 'everything'
        : storyFrequency && `${communitySlug}/~${storyFrequency.slug}`;

      returnUrl = active === 'explore'
        ? 'explore'
        : storyFrequency && `${communitySlug}/~${storyFrequency.slug}`;
    }

    if (story && !composer.isOpen) {
      const storyHref = storyFrequency
        ? `/${communitySlug}/~${storyFrequency.slug}/${story.id}`
        : `/everything/${story.id}`;
      return (
        <ViewContainer>
          <Link to={`/${returnUrl}`}>
            <BackArrow onClick={this.clearActiveStory}>
              <Icon icon="back" />
            </BackArrow>
          </Link>

          <StoryChatContainer
            innerRef={comp => this.comp = comp}
            locked={story.locked}
            onScroll={this.onScroll}
          >
            <Story story={story} frequency={storyFrequency} active={active} />
            <ActionBar
              locked={locked}
              moderator={role}
              creator={creator}
              story={story}
              shareUrl={`https://spectrum.chat${storyHref}`}
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
    } else if (communitySlug === 'explore') {
      return (
        <ViewContainer>
          <Link to={`/everything`}>
            <BackArrow onClick={this.clearActiveStory}>
              <Icon icon="back" />
            </BackArrow>
          </Link>
          <Explore />
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
  communities: state.communities,
});

export default connect(mapStateToProps)(RightColumn);
