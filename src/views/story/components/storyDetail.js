// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withRouter } from 'react-router';
import { openModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import { setStoryLockMutation } from '../mutations';
import { deleteStoryMutation } from '../../../api/story';
import Icon from '../../../components/icons';
import Dropdown from '../../../components/dropdown';
import { Button, IconButton } from '../../../components/buttons';
import {
  StoryWrapper,
  StoryHeading,
  Byline,
  StoryContent,
  ContextRow,
  DropWrap,
  FlyoutRow,
} from '../style';

const StoryDetailPure = ({
  story,
  setStoryLock,
  deleteStory,
  dispatch,
  currentUser,
  history,
}) => {
  const storyLock = (id, value) =>
    setStoryLock({
      id,
      value,
    })
      .then(({ data: { setStoryLock } }) => {
        if (setStoryLock) {
          dispatch(addToastWithTimeout('neutral', 'Story locked.'));
        } else {
          dispatch(addToastWithTimeout('success', 'Story unlocked!'));
        }
      })
      .catch(err => {
        dispatch(addToastWithTimeout('error', err));
      });

  const triggerDelete = (e, id) => {
    e.preventDefault();

    let message;

    if (story.isCommunityOwner && !story.isAuthor) {
      message = `You are about to delete another person's story. As the owner of the ${story.frequency.community.name} community, you have permission to do this. The story creator will be notified that this story was deleted.`;
    } else if (story.isFrequencyOwner && !story.isAuthor) {
      message = `You are about to delete another person's story. As the owner of the ${story.frequency} frequency, you have permission to do this. The story creator will be notified that this story was deleted.`;
    } else if (story.isAuthor) {
      message = 'Are you sure you want to delete this story?';
    } else {
      message = 'Are you sure you want to delete this story?';
    }

    return dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id,
        entity: 'story',
        message,
      })
    );
  };

  const openUserProfileModal = (e, user: Object) => {
    e.preventDefault();
    return dispatch(openModal('USER_PROFILE_MODAL', { user }));
  };

  return (
    <StoryWrapper>
      <ContextRow>
        <Byline onClick={e => openUserProfileModal(e, story.author)}>
          {story.author.displayName}
        </Byline>
        {currentUser &&
          (story.isAuthor ||
            story.isFrequencyOwner ||
            story.isCommunityOwner) &&
          <DropWrap>
            <Icon icon="settings" />
            <Dropdown width={'48px'}>
              {(story.isFrequencyOwner || story.isCommunityOwner) &&
                <FlyoutRow>
                  <IconButton
                    icon="freeze"
                    onClick={() => storyLock(story.id, !story.locked)}
                  />
                </FlyoutRow>}
              {story.isAuthor &&
                <FlyoutRow>
                  <IconButton icon="lock" />
                </FlyoutRow>}
              {(story.isAuthor ||
                story.isFrequencyOwner ||
                story.isCommunityOwner) &&
                <FlyoutRow>
                  <IconButton
                    icon="delete"
                    onClick={e => triggerDelete(e, story.id)}
                  />
                </FlyoutRow>}
            </Dropdown>
          </DropWrap>}
      </ContextRow>
      <StoryHeading>
        {story.content.title}
      </StoryHeading>
      {!!story.content.description &&
        <StoryContent>{story.content.description}</StoryContent>}
    </StoryWrapper>
  );
};

const StoryDetail = compose(
  setStoryLockMutation,
  deleteStoryMutation,
  withRouter,
  pure
)(StoryDetailPure);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(StoryDetail);
