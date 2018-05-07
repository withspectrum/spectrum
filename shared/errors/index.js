// @flow
import * as errors from './error-types';
import * as events from '../analytics/event-types';

const dictionary = {
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
};

export const getMessageFromErrorType = (errorType: string) => {
  return dictionary[errorType].message;
};

export const getEventTypeFromErrorType = (errorType: string) => {
  return dictionary[errorType].event;
};
