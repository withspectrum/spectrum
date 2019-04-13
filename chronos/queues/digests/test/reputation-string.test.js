// @flow
import { getReputationString } from '../getReputationString';

describe('first-time users', () => {
  it('should get an explanation what reputation is', () => {
    expect(
      getReputationString({
        timeframe: 'weekly',
        reputationGained: 10,
        totalReputation: 10,
      })
    ).toMatchSnapshot();
  });

  it("should be told when they haven't gained any reputation", () => {
    expect(
      getReputationString({
        timeframe: 'weekly',
        reputationGained: 0,
        totalReputation: 0,
      })
    ).toMatchSnapshot();
  });
});

describe('existing users', () => {
  it('should handle no reputation gain', () => {
    expect(
      getReputationString({
        timeframe: 'weekly',
        reputationGained: 0,
        totalReputation: 10,
      })
    ).toMatchSnapshot();
  });

  it('should handle reputation gain', () => {
    expect(
      getReputationString({
        timeframe: 'weekly',
        reputationGained: 10,
        totalReputation: 20,
      })
    ).toMatchSnapshot();
  });
});

it('should handle a daily timeframe', () => {
  expect(
    getReputationString({
      timeframe: 'daily',
      reputationGained: 10,
      totalReputation: 20,
    })
  ).toMatchSnapshot();

  expect(
    getReputationString({
      timeframe: 'daily',
      reputationGained: 0,
      totalReputation: 0,
    })
  ).toMatchSnapshot();
});
