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
import { Card } from '../../../components/card';
import { Button } from '../../../components/buttons';

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

    if (story.isCommunityOwner && !story.isCreator) {
      message = `You are about to delete another person's story. As the owner of the ${story.frequency.community.name} community, you have permission to do this. The story creator will be notified that this story was deleted.`;
    } else if (story.isFrequencyOwner && !story.isCreator) {
      message = `You are about to delete another person's story. As the owner of the ${story.frequency} frequency, you have permission to do this. The story creator will be notified that this story was deleted.`;
    } else if (story.isCreator) {
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
    <Card>
      <h3>
        {story.content.title}
        {' '}
        by
        {' '}
        <span onClick={e => openUserProfileModal(e, story.author)}>
          {story.author.displayName}
        </span>
      </h3>
      <p>{story.content.description}</p>

      {currentUser &&
        (story.isFrequencyOwner || story.isCommunityOwner) &&
        <Button onClick={() => storyLock(story.id, !story.locked)}>
          {story.locked ? 'Unlock' : 'Lock'}
        </Button>}

      {currentUser &&
        (story.isCreator || story.isFrequencyOwner || story.isCommunityOwner) &&
        <Button onClick={e => triggerDelete(e, story.id)}>
          Delete
        </Button>}

      {currentUser &&
        story.isCreator &&
        <Button>
          Edit
        </Button>}
    </Card>
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
