//@flow

import { getMentionsPositionsFromMessage } from '../core';

describe('mentions-decorator core', () => {
  it('should return the start and and positions of mentions on a string', () => {
    const message = 'Hello @ale @ange @ale @ange bye';
    const expectedResult = [
      {
        startPos: 6,
        endPos: 10,
      },
      {
        startPos: 11,
        endPos: 16,
      },
      {
        startPos: 17,
        endPos: 21,
      },
      {
        startPos: 22,
        endPos: 27,
      },
    ];

    expect(getMentionsPositionsFromMessage(message)).toEqual(expectedResult);
  });

  it('should return an empty array if there are no mentions', () => {
    const message = 'Hello one two three bye';
    const expectedResult = [];

    expect(getMentionsPositionsFromMessage(message)).toEqual(expectedResult);
  });
});
