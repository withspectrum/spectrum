import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ChatDetail from '../ChatDetail';
import Icon from '../../../shared/Icons';
import Markdown from '../../../shared/Markdown';
import {
  ScrollBody,
  ContentView,
  Header,
  StoryTitle,
  Flex,
  FlexColumn,
  FlexColumnEnd,
  Byline,
  Media,
  HiddenButton,
  HiddenLabel,
  HiddenInput,
  BackArrow,
  DeleteConfirm,
} from './style';
import { openGallery } from '../../../actions/gallery';
import { getCurrentFrequency } from '../../../helpers/frequencies';
import { toggleLockedStory, deleteStory } from '../../../actions/stories';
import { track } from '../../../EventTracker';

class StoryView extends Component {
  state = {
    deleteInited: false,
  };

  componentDidMount() {
    this.addEventListeners();
  }

  componentDidUpdate() {
    // account for story switching where the story may or may not contain images
    this.addEventListeners();
  }

  addEventListeners = () => {
    // we're going to loop through all the dom nodes of the story and look for images so that we can attach event listeners for the gallery
    let story = this.refs.story;
    let imageNodes = story.querySelectorAll('img');

    for (let image of imageNodes) {
      image.addEventListener('click', this.openGallery, false);
    }
  };

  openGallery = e => {
    this.props.dispatch(openGallery(e));
  };

  initDeleteStory = () => {
    track('story', 'delete inited', null);

    this.setState({
      deleteInited: !this.state.deleteInited,
    });
  };

  scrollToBottom = () => {
    if (!this.comp) return;
    let node = this.comp;
    if (node.scrollHeight - node.clientHeight < node.scrollTop + 140) {
      node.scrollTop = node.scrollHeight - node.clientHeight;
    }
  };

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
    let story = this.getActiveStory();
    this.props.dispatch(deleteStory(story.id));
  };

  toggleLockedStory = () => {
    let story = this.getActiveStory();
    this.props.dispatch(toggleLockedStory(story));
  };

  clearActiveStory = () => {
    this.props.dispatch({
      type: 'CLEAR_ACTIVE_STORY',
    });
  };

  render() {
    let story = this.props.activeStory;
    let creator = this.props.creator;
    let moderator = this.props.moderator;
    let locked = this.props.locked;
    let frequencies = this.props.frequencies;
    let currentFrequency = getCurrentFrequency(
      story.frequencyId,
      frequencies.frequencies,
    );
    let returnUrl = this.props.frequencies.active === 'everything'
      ? 'everything'
      : currentFrequency && currentFrequency.slug;
    return (
      <Flex>
        <Link to={`/~${returnUrl}`}>
          <BackArrow onClick={this.clearActiveStory}>
            <Icon icon="back" />
          </BackArrow>
        </Link>

        <ScrollBody innerRef={comp => this.comp = comp}>
          <ContentView>
            <Header>
              <FlexColumn>
                <Byline>{story.creator.displayName}</Byline>
                <StoryTitle>{story.content.title}</StoryTitle>
              </FlexColumn>
              <FlexColumnEnd>
                <a
                  href={
                    `https://twitter.com/intent/tweet/?text=${encodeURIComponent(
                      story.content.title.substr(0, 85),
                    )}&amp;url=https://spectrum.chat/~${currentFrequency &&
                      currentFrequency.slug ||
                      '~everything'}/${story.id}`
                  }
                  target="_blank"
                >
                  <HiddenLabel tipText="Share story" tipLocation="left">
                    <Icon icon="share" subtle />
                  </HiddenLabel>
                </a>
                {(creator || moderator === 'owner') &&
                  <label>
                    {locked
                      ? <HiddenLabel tipText="Unfreeze Chat" tipLocation="left">
                          <Icon icon="freeze" color="warn.default" />
                        </HiddenLabel>
                      : <HiddenLabel tipText="Freeze Chat" tipLocation="left">
                          <Icon icon="freeze" color="success.alt" subtle />
                        </HiddenLabel>}
                    <HiddenInput
                      type="checkbox"
                      onChange={this.toggleLockedStory}
                      checked={locked}
                    />
                  </label>}
                {(creator || moderator === 'owner') &&
                  <HiddenButton
                    onClick={this.initDeleteStory}
                    tipText="Delete Story"
                    tipLocation="bottom"
                    visible={this.state.deleteInited}
                  >
                    <Icon icon="delete" color="warn.default" subtle />
                    <DeleteConfirm
                      visible={this.state.deleteInited}
                      onClick={this.deleteStory}
                    >
                      Confirm
                    </DeleteConfirm>
                  </HiddenButton>}
              </FlexColumnEnd>
            </Header>
            <div className="markdown" ref="story">
              <Markdown>{story.content.description}</Markdown>
            </div>
            {story.content.media && story.content.media !== ''
              ? <Media src={story.content.media} onClick={this.openGallery} />
              : ''}
          </ContentView>
          <ChatDetail scrollToBottom={this.scrollToBottom} story={story} />
        </ScrollBody>
      </Flex>
    );
  }
}

const mapStateToProps = state => ({
  stories: state.stories,
  frequencies: state.frequencies,
  user: state.user,
});

export default connect(mapStateToProps)(StoryView);
