// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { connect } from 'react-redux';
import { openModal } from '../../../actions/modals';
import { setStoryLockMutation } from '../mutations';
import { Card } from '../../../components/card';
import { Button } from '../../../components/buttons';

const StoryDetailPure = ({ story, setStoryLock, dispatch }) => {
  const storyLock = (id, value) =>
    setStoryLock({
      id,
      value,
    }).catch(error => {
      console.log('Error locking story: ', error);
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

      <Button onClick={() => storyLock(story.id, !story.locked)}>
        {story.locked ? 'Unlock' : 'Lock'}
      </Button>
    </Card>
  );
};

const StoryDetail = compose(setStoryLockMutation, pure)(StoryDetailPure);
export default connect()(StoryDetail);
