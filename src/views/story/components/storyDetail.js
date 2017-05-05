// @flow
import React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
import { setStoryLock } from '../mutations';
import { Card } from '../../../components/card';
import { Button } from '../../../components/buttons';

const StoryDetailPure = ({ story, setStoryLock }) => {
  const triggerSetStoryLock = (id, value) => {
    return setStoryLock({
      id,
      value,
    })
      .then(({ data }) => {
        // do something with returned data
      })
      .catch(error => {
        console.log('Error locking story: ', error);
      });
  };

  return (
    <Card>
      <h3>{story.content.title} by {story.author.displayName}</h3>
      <p>{story.content.description}</p>

      <Button onClick={() => triggerSetStoryLock(story.id, !story.locked)}>
        {story.locked ? 'Unlock' : 'Lock'}
      </Button>
    </Card>
  );
};

export const StoryDetail = compose(setStoryLock, pure)(StoryDetailPure);
