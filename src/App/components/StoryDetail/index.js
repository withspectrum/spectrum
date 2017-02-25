import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import ChatDetail from '../ChatDetail';
import Markdown from 'react-remarkable';
import { Lock, Unlock, Delete } from '../../../shared/Icons';
import {
  ScrollBody,
  ContentView,
  Header,
  StoryTitle,
  FlexColumn,
  FlexColumnEnd,
  Byline,
  Media,
  HiddenButton,
  HiddenLabel,
  HiddenInput,
  BackArrow,
} from './style';
import { showGallery } from '../../../actions/gallery';
import { getCurrentFrequency } from '../../../helpers/frequencies';
import { hashToArray } from '../../../helpers/utils';
import { toggleLockedStory, deleteStory } from '../../../actions/stories';

class StoryView extends Component {
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
      image.addEventListener('click', this.showGallery, false);
    }
  };

  showGallery = e => {
    this.props.dispatch(showGallery(e));
  };

  scrollToBottom = () => {
    let node = ReactDOM.findDOMNode(this);
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
      story.frequency,
      frequencies.frequencies,
    );
    let returnUrl = this.props.frequencies.active === 'everything'
      ? 'everything'
      : currentFrequency.slug;
    return (
      <ScrollBody>
        <Link to={`/~${returnUrl}`}>
          <BackArrow onClick={this.clearActiveStory}>←</BackArrow>
        </Link>

        <ContentView>
          <Header>
            <FlexColumn>
              <Byline>{story.creator.displayName}</Byline>
              <StoryTitle>{story.content.title}</StoryTitle>
            </FlexColumn>
            {creator || moderator === 'owner'
              ? // if the story was created by the current user, or is in a frequency the current user owns
                <FlexColumnEnd>
                  <label>
                    {locked
                      ? <HiddenLabel tipText="Story locked" tipLocation="left">
                          <Lock color="warn" stayActive />
                        </HiddenLabel>
                      : <HiddenLabel
                          tipText="Story unlocked"
                          tipLocation="left"
                        >
                          <Unlock />
                        </HiddenLabel>}
                    <HiddenInput
                      type="checkbox"
                      onChange={this.toggleLockedStory}
                      checked={locked}
                    />
                  </label>
                  <HiddenButton
                    onClick={this.deleteStory}
                    tipText="Delete Story"
                    tipLocation="left"
                  >
                    <Delete color="warn" />
                  </HiddenButton>
                </FlexColumnEnd>
              : ''}
          </Header>
          <div className="markdown" ref="story">
            <Markdown
              options={{
                html: true,
                linkify: true,
              }}
              source={story.content.description}
            />
          </div>
          {story.content.media && story.content.media !== ''
            ? <Media src={story.content.media} onClick={this.showGallery} />
            : ''}
        </ContentView>
        <ChatDetail scrollToBottom={this.scrollToBottom} />
      </ScrollBody>
    );
  }
}

const mapStateToProps = state => ({
  stories: state.stories,
  frequencies: state.frequencies,
  user: state.user,
});

export default connect(mapStateToProps)(StoryView);
