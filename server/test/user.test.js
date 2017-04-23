import { graphql } from 'graphql';
import { db as mockDb, setup, teardown, data } from './db';
jest.mock('../models/db', () => ({
  db: mockDb,
}));

import schema from '../schema';

describe('queries', () => {
  beforeAll(() => setup(mockDb));
  afterAll(() => teardown(mockDb));

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

    return graphql(schema, query).then(result => {
      expect(result.errors).toBeUndefined();
      expect(result.data.user).toBeDefined();
      expect(result.data.user).toMatchSnapshot();
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

    return graphql(schema, query).then(result => {
      expect(result.errors).toBeUndefined();
      expect(result.data.user).toBeNull();
    });
  });

  it.skip('fetches a users communities');
  it.skip('fetches a users frequencies');
});
