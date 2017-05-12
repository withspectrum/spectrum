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
import Markdown from '../../../components/markdown';
import { Raw, Plain } from '../../../components/editor';

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

  let description = story.content.description;
  if (story.content.type === 'SLATE') {
    description = Plain.serialize(
      Raw.deserialize(JSON.parse(description), { terse: true })
    );
  }

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
      <Markdown>{description}</Markdown>

      {currentUser &&
        (story.isCreator || story.isFrequencyOwner || story.isCommunityOwner) &&
        <Button onClick={() => storyLock(story.id, !story.locked)}>
          {story.locked ? 'Unlock' : 'Lock'}
        </Button>}
    </Card>
  );
};

const StoryDetail = compose(setStoryLockMutation, pure)(StoryDetailPure);
const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(StoryDetail);
