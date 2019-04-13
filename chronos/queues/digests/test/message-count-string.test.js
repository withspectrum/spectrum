// @flow
import { getMessageCountString } from '../processThreads';

describe('new thread', () => {
  it('should get new thread string', () => {
    expect(getMessageCountString(0, 0)).toMatchSnapshot();
  });

  it('should get thread with one new message string', () => {
    expect(getMessageCountString(1, 1)).toMatchSnapshot();
  });

  it('should get thread with more than one new message string', () => {
    expect(getMessageCountString(2, 2)).toMatchSnapshot();
  });

  it('should get thread with new and total string', () => {
    expect(getMessageCountString(2, 10)).toMatchSnapshot();
  });
});
