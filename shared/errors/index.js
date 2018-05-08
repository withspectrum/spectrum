// @flow
import { dictionary } from './dictionary';
import * as errors from './error-types';

const getMessageFromErrorType = (errorType: string) => {
  return dictionary[errorType].message;
};

const getEventTypeFromErrorType = (errorType: string) => {
  return dictionary[errorType].event;
};

export { errors, getMessageFromErrorType, getEventTypeFromErrorType };
