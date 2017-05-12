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

const StoryDetailPure = ({ story, setStoryLock, dispatch, currentUser }) => {
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

      {currentUser &&
        (story.isFrequencyOwner || story.isCommunityOwner) &&
        <Button onClick={() => storyLock(story.id, !story.locked)}>
          {story.locked ? 'Unlock' : 'Lock'}
        </Button>}

      {currentUser &&
        (story.isCreator || story.isFrequencyOwner || story.isCommunityOwner) &&
        <Button>
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

const StoryDetail = compose(setStoryLockMutation, pure)(StoryDetailPure);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(StoryDetail);
