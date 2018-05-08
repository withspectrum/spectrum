// @flow
import * as errors from './error-types';
import * as events from '../analytics/event-types';

export const dictionary = {
  [errors.CHANNEL_ARCHIVED_FAILED_NO_PERMISSIONS]: {
    message: 'You don’t have permission to archive this channel',
    event: events.CHANNEL_ARCHIVED_FAILED,
  },
  [errors.CHANNEL_ARCHIVED_FAILED_ALREADY_ARCHIVED]: {
    message: 'This channel has already been archived',
    event: events.CHANNEL_ARCHIVED_FAILED,
  },
  [errors.CHANNEL_ARCHIVED_FAILED_GENERAL]: {
    message: 'The general channel can’t be archived',
    event: events.CHANNEL_ARCHIVED_FAILED,
  },
  [errors.CHANNEL_RESTORED_FAILED_NO_PERMISSIONS]: {
    message: 'You don’t have permission to restore this channel',
    event: events.CHANNEL_RESTORED_FAILED,
  },
  [errors.CHANNEL_CREATED_FAILED_NO_PERMISSIONS]: {
    message: 'You don’t have permission to create channels in this community',
    event: events.CHANNEL_CREATED_FAILED,
  },
  [errors.CHANNEL_CREATED_FAILED_NAME_RESERVED]: {
    message: 'This channel name is reserved - try another url for this channel',
    event: events.CHANNEL_CREATED_FAILED,
  },
  [errors.CHANNEL_CREATED_FAILED_SLUG_EXISTS]: {
    message:
      'This channel url has already been used - try another url for this channel',
    event: events.CHANNEL_CREATED_FAILED,
  },
};
