//@flow
import React, { Component } from 'react';
//$FlowFixMe
import deepEqual from 'deep-eql';
//$FlowFixMe
import { connect } from 'react-redux';
import Icon from '../../../../../shared/Icons';
import {
  toggleLockedStory,
  deleteStory,
  initEditStory,
} from '../../../../../actions/stories';
import { track } from '../../../../../EventTracker';

import {
  ActionBarContainer,
  HiddenInput,
  DeleteConfirm,
  HiddenButton,
} from './style';

class StoryActions extends Component {
  state = {
    deleteInited: false,
  };

  shouldComponentUpdate(nextProps: Object, nextState: Object) {
    return !deepEqual(nextProps, this.props) || nextState !== this.state;
  }

  initDeleteStory = () => {
    track('story', 'delete inited', null);
    const state = !this.state.deleteInited;
    this.setState({
      deleteInited: state,
    });
  };

  deleteStory = () => {
    let { story } = this.props;
    this.props.dispatch(deleteStory(story.id));
  };

  toggleLockedStory = () => {
    let { story } = this.props;
    this.props.dispatch(toggleLockedStory(story));
  };

  initEditStory = () => {
    let { story } = this.props;
    this.props.dispatch(initEditStory(story));
  };

  render() {
    let {
      communityRole,
      story,
      currentUser,
      frequency,
      community,
    } = this.props;

    const canEdit = story.creator.uid === currentUser.uid;
    const canDelete = story.creator.uid === currentUser.uid ||
      communityRole === 'owner';
    const canFreeze = communityRole === 'owner';
    const shareUrl = `https://spectrum.chat/${community.slug}/~${frequency.slug}/${story.id}`;
    return (
      <ActionBarContainer>
        <a
          href={
            `https://twitter.com/intent/tweet/?text=${encodeURIComponent(
              story.content.title.substr(0, 85),
            )}&amp;url=${shareUrl}`
          }
          target="_blank"
          style={{ display: 'inline-block' }}
        >
          <Icon
            icon="share"
            subtle
            tipText="Share story"
            tipLocation="top-right"
          />
        </a>

        <div>
          {canEdit &&
            <span onClick={this.initEditStory}>
              <Icon
                tipText={'Edit Story'}
                tipLocation="top-left"
                icon="edit"
                color={'warn.default'}
                subtle={true}
              />
            </span>}

          {canDelete &&
            <HiddenButton
              onClick={this.initDeleteStory}
              visible={this.state.deleteInited}
            >
              <Icon
                tipText="Delete Story"
                tipLocation="top-left"
                icon="delete"
                color="warn.default"
                subtle
              />

              <DeleteConfirm
                visible={this.state.deleteInited}
                onClick={this.deleteStory}
              >
                Confirm
              </DeleteConfirm>
            </HiddenButton>}

          {canFreeze &&
            <label>
              <Icon
                tipText={story.locked ? 'Unfreeze Chat' : 'Freeze Chat'}
                tipLocation="top-left"
                icon="freeze"
                color={story.locked ? 'brand.default' : 'success.alt'}
                subtle={story.locked ? false : true}
              />

              <HiddenInput
                type="checkbox"
                onChange={this.toggleLockedStory}
                checked={story.locked}
              />
            </label>}

        </div>
      </ActionBarContainer>
    );
  }
}

export default connect()(StoryActions);
