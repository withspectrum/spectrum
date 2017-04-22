// @flow
import React from 'react';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import { LockStoryButton } from './lockStoryButton';

const StoryDetailPure = ({ story }) => (
  <div>
    <h3>{story.content.title} by {story.author.displayName}</h3>
    <p>{story.content.description}</p>
    <LockStoryButton
      label={story.locked ? 'Unlock' : 'Lock'}
      id={story.id}
      value={!story.locked}
    />
  </div>
);

export const StoryDetail = compose(pure)(StoryDetailPure);
