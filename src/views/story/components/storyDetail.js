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
import { setStoryLockMutation, deleteStoryMutation } from '../mutations';
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

  const triggerDelete = id =>
    deleteStory({
      id,
    })
      .then(({ data: { deleteStory } }) => {
        if (deleteStory) {
          history.push(`/`);
          dispatch(addToastWithTimeout('neutral', 'Story deleted.'));
        }
      })
      .catch(err => {
        dispatch(
          addToastWithTimeout(
            'error',
            `Something went wrong and we weren't able to delete this story. ${err}`
          )
        );
      });

  const openUserProfileModal = (user: Object) => {
    return dispatch(openModal('USER_PROFILE_MODAL', { user }));
  };

  return (
    <Card>
      <h3>
        {story.content.title}
        {' '}
        by
        {' '}
        <span onClick={() => openUserProfileModal(story.author)}>
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
        <Button onClick={() => triggerDelete(story.id)}>
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
