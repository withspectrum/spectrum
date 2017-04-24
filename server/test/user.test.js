import { graphql } from 'graphql';
import { db as mockTestDb, setup, teardown, data } from './db';
jest.mock('../models/db', () => ({
  db: mockTestDb,
}));

import schema from '../schema';

describe('queries', () => {
  beforeAll(() => setup(mockTestDb));
  afterAll(() => teardown(mockTestDb));

  it('should fetch a user', () => {
    const query = /* GraphQL */ `
			{
				user(id: "first-user") {
					uid
					createdAt
					lastSeen
					photoURL
					displayName
					username
					email
				}
			}
		`;

    expect.assertions(1);
    return graphql(schema, query).then(result => {
      expect(result).toMatchSnapshot();
    });
  });

  it('should return null for a non-existant id', () => {
    const query = /* GraphQL */ `
			{
				user(id: "non-existant") {
					uid
				}
			}
		`;

    expect.assertions(1);
    return graphql(schema, query).then(result => {
      expect(result).toMatchSnapshot();
    });
  });

  it.skip('fetches a users communities');
  it.skip('fetches a users frequencies');
});
