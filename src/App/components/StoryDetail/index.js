import React, { Component } from 'react';
import ReactDOM from 'react-dom';
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
  TextBody,
  Media,
  HiddenButton,
  HiddenLabel,
  HiddenInput,
} from './style';
import actions from '../../../actions';

class StoryView extends Component {
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

  componentWillUpdate() {
    var node = ReactDOM.findDOMNode(this);
    this.shouldScrollBottom = node.scrollTop + node.offsetHeight ===
      node.scrollHeight ||
      node.scrollTop === 0;
  }

  deleteStory = () => {
    const story = this.getActiveStory();
    this.props.dispatch(actions.deleteStory(story.id));
  };

  toggleLockedStory = () => {
    const story = this.getActiveStory();
    this.props.dispatch(actions.toggleLockedStory(story));
  };

  render() {
    let story = this.props.activeStory;
    let creator = this.props.creator;
    let moderator = this.props.moderator;
    let locked = this.props.locked;

    return (
      <ScrollBody>
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
          <Markdown source={story.content.description} />
          {story.content.media && story.content.media !== ''
            ? <Media src={story.content.media} onClick={this.showGallery} />
            : ''}
        </ContentView>
        <ChatDetail />
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
