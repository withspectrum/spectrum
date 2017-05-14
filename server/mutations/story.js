// @flow
// $FlowFixMe
const { UserError } = require('graphql-errors');
import { getFrequencies } from '../models/frequency';
import { getCommunities } from '../models/community';
const {
  getStories,
  publishStory,
  deleteStory,
  setStoryLock,
  editStory,
} = require('../models/story');

module.exports = {
  Mutation: {
    publishStory: (_, { story }, { user }) => {
      // user must be authed to publish a story
      if (!user)
        return new UserError('You must be signed in to publish a new story.');

      return (
        getFrequencies([story.frequency])
          // return the frequencies
          .then(frequencies => {
            // select the frequency the story is being published in
            const frequency = frequencies[0];

            // if frequency wasn't found
            if (!frequency) {
              return new UserError("This frequency doesn't exist");
            }

            // if user isn't a frequency subscriber
            if (!(frequency.subscribers.indexOf(user.uid) > -1)) {
              return new UserError(
                "You don't have permission to post stories in this frequency."
              );
            }

            // all checks passed
            return publishStory(story, user);
          })
      );
    },
    editStory: (_, { id, newContent }, { user }) => {
      // user must be authed to edit a story
      if (!user)
        return new UserError(
          'You must be signed in to make changes to this story.'
        );
      return getStories([id]).then(stories => {
        // select the story
        const story = stories[0];

        // if the story doesn't exist
        if (!story) {
          return new UserError("This story doesn't exist");
        }

        // only the story author can edit the story
        if (story.author !== user.uid) {
          return new UserError(
            "You don't have permission to make changes to this story."
          );
        }

        // all checks passed
        return editStory(id, newContent);
      });
    },
    deleteStory: (_, { id }, { user }) => {
      // user must be authed to delete a story
      if (!user)
        return new UserError(
          'You must be signed in to make changes to this story.'
        );

      // get the story being delete
      return getStories([id])
        .then(stories => {
          // select the story
          const story = stories[0];

          // if the story doesn't exist
          if (!story || story.deleted) {
            return new UserError("This story doesn't exist");
          }

          // get the frequency the story was posted in
          const frequencies = getFrequencies([story.frequency]);
          // get the community the story was posted in
          const communities = getCommunities([story.community]);

          // return the story, frequencies and communities
          return Promise.all([story, frequencies, communities]);
        })
        .then(([story, frequencies, communities]) => {
          // select the frequency and community
          const frequency = frequencies[0];
          const community = communities[0];

          // user owns the community or the frequency, they can delete the story
          if (
            community.owners.indexOf(user.uid) > -1 ||
            frequency.owners.indexOf(user.uid) > -1
          ) {
            return deleteStory(id);
          }

          // if the story author does not match the currentUser
          if (story.author !== user.uid) {
            return new UserError(
              "You don't have permission to make changes to this story."
            );
          }

          // all checks passed
          return deleteStory(id);
        });
    },
    setStoryLock: (_, { id, value }, { user }) => {
      // user must be authed to edit a story
      if (!user)
        return new UserError(
          'You must be signed in to make changes to this story.'
        );

      // get the story being locked
      return getStories([id])
        .then(stories => {
          // select the story
          const story = stories[0];

          // if the story doesn't exist
          if (!story) {
            return new UserError("This story doesn't exist");
          }

          // get the frequency the story was posted in
          const frequencies = getFrequencies([story.frequency]);
          // get the community the story was posted in
          const communities = getCommunities([story.community]);

          // return the story, frequencies and communities
          return Promise.all([story, frequencies, communities]);
        })
        .then(([story, frequencies, communities]) => {
          // select the frequency and community
          const frequency = frequencies[0];
          const community = communities[0];

          // user owns the community or the frequency, they can delete the story
          if (
            community.owners.indexOf(user.uid) > -1 ||
            frequency.owners.indexOf(user.uid) > -1
          ) {
            return setStoryLock(id, value);
          }

          // if the user is not a frequency or community owner, the story can't be locked
          return new UserError(
            "You don't have permission to make changes to this story."
          );
        });
    },
  },
};
