// @flow
import formatNotification from '../notification-formatting';
import CHANNEL_CREATED_FIXTURE from './fixtures/CHANNEL_CREATED.json';
import COMMUNITY_INVITE_FIXTURE from './fixtures/COMMUNITY_INVITE.json';
import MESSAGE_CREATED_FIXTURE from './fixtures/MESSAGE_CREATED.json';
import DIRECT_MESSAGE_CREATED_FIXTURE from './fixtures/DIRECT_MESSAGE_CREATED.json';
import REACTION_CREATED_FIXTURE from './fixtures/REACTION_CREATED.json';
import THREAD_CREATED_FIXTURE from './fixtures/THREAD_CREATED.json';
import USER_JOINED_COMMUNITY_FIXTURE from './fixtures/USER_JOINED_COMMUNITY.json';

const USER_ID = 'gVk5mYwccUOEKiN5vtOouqroGKo1';

it('should format a channel creation notification', () => {
  let result = formatNotification(CHANNEL_CREATED_FIXTURE, USER_ID);
  expect(result.raw).toBeDefined();
  delete result.raw; // Don't need raw data
  expect(result).toMatchSnapshot();
});

it('should format a community invite notification', () => {
  let result = formatNotification(COMMUNITY_INVITE_FIXTURE, USER_ID);
  expect(result.raw).toBeDefined();
  delete result.raw; // Don't need raw data
  expect(result).toMatchSnapshot();
});

it('should format a message creation notification', () => {
  let result = formatNotification(MESSAGE_CREATED_FIXTURE, USER_ID);
  expect(result.raw).toBeDefined();
  delete result.raw; // Don't need raw data
  expect(result).toMatchSnapshot();
});

it('should format a direct message creation notification', () => {
  let result = formatNotification(DIRECT_MESSAGE_CREATED_FIXTURE, USER_ID);
  expect(result.raw).toBeDefined();
  delete result.raw; // Don't need raw data
  expect(result).toMatchSnapshot();
});

it('should format a reaction creation notification', () => {
  let result = formatNotification(REACTION_CREATED_FIXTURE, USER_ID);
  expect(result.raw).toBeDefined();
  delete result.raw; // Don't need raw data
  expect(result).toMatchSnapshot();
});

it('should format a thread creation notification', () => {
  let result = formatNotification(THREAD_CREATED_FIXTURE, USER_ID);
  expect(result.raw).toBeDefined();
  delete result.raw; // Don't need raw data
  expect(result).toMatchSnapshot();
});

it('should format a user joined community notification', () => {
  let result = formatNotification(USER_JOINED_COMMUNITY_FIXTURE, USER_ID);
  expect(result.raw).toBeDefined();
  delete result.raw; // Don't need raw data
  expect(result).toMatchSnapshot();
});
