import React, { Component } from 'react';
import { connect } from 'react-redux';
import Icon from '../../../../shared/Icons';
import { getCurrentFrequency } from '../../../../helpers/frequencies';
import {
  toggleLockedStory,
  deleteStory,
  initEditStory,
} from '../../../../actions/stories';
import { track } from '../../../../EventTracker';

import {
  ActionBarContainer,
  HiddenInput,
  DeleteConfirm,
  HiddenButton,
} from './style';

class ActionBar extends Component {
  state = {
    deleteInited: false,
  };

  initDeleteStory = () => {
    track('story', 'delete inited', null);

    this.setState({
      deleteInited: !this.state.deleteInited,
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
    let { creator, moderator, locked, frequencies, story } = this.props;
    let currentFrequency = getCurrentFrequency(
      story.frequencyId,
      frequencies.frequencies,
    );

    return (
      <ActionBarContainer>
        <a
          href={
            `https://twitter.com/intent/tweet/?text=${encodeURIComponent(
              story.content.title.substr(0, 85),
            )}&amp;url=https://spectrum.chat/${currentFrequency &&
              `~${currentFrequency.slug}` ||
              'everything'}/${story.id}`
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

        {(creator || moderator === 'owner') &&
          <div>
            <span onClick={this.initEditStory}>
              <Icon
                tipText={'Edit Story'}
                tipLocation="top-left"
                icon="edit"
                color={'warn.default'}
                subtle={true}
              />
            </span>

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
            </HiddenButton>

            <label>
              <Icon
                tipText={locked ? 'Unfreeze Chat' : 'Freeze Chat'}
                tipLocation="top-left"
                icon="freeze"
                color={locked ? 'brand.default' : 'success.alt'}
                subtle={locked ? false : true}
              />

              <HiddenInput
                type="checkbox"
                onChange={this.toggleLockedStory}
                checked={locked}
              />
            </label>
          </div>}

      </ActionBarContainer>
    );
  }
}

const mapStateToProps = state => ({
  frequencies: state.frequencies,
});

export default connect(mapStateToProps)(ActionBar);
