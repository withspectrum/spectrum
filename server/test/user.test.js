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
					id
					createdAt
					lastSeen
					profilePhoto
					name
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
					id
				}
			}
		`;

    expect.assertions(1);
    return graphql(schema, query).then(result => {
      expect(result).toMatchSnapshot();
    });
  });

  describe('everything', () => {
    it('should return the latest thread', () => {
      const query = /* GraphQL */ `
  			{
  				user(id: "first-user") {
  					everything(first: 1) {
              pageInfo {
                hasNextPage
              }
              edges {
                node {
                  id
                }
              }
            }
  				}
  			}
  		`;
      expect.assertions(1);
      return graphql(schema, query).then(result => {
        expect(result).toMatchSnapshot();
      });
    });

    it('should paginate based on the after property', () => {
      const query = /* GraphQL */ `
  			{
  				user(id: "first-user") {
  					everything(first: 1, after: "c2Vjb25kLXN0b3J5") {
              pageInfo {
                hasNextPage
              }
              edges {
                node {
                  id
                }
              }
            }
  				}
  			}
  		`;
      expect.assertions(1);
      return graphql(schema, query).then(result => {
        expect(result).toMatchSnapshot();
      });
    });

    it('should handle first being set to 0 correctly', () => {
      const noCursorQuery = /* GraphQL */ `
  			{
  				user(id: "first-user") {
  					everything(first: 0) {
              pageInfo {
                hasNextPage
              }
              edges {
                node {
                  id
                }
              }
            }
  				}
  			}
  		`;
      const cursorQuery = /* GraphQL */ `
  			{
  				user(id: "first-user") {
  					everything(first: 0, after: "Zmlyc3Qtc3Rvcnk=") {
              pageInfo {
                hasNextPage
              }
              edges {
                node {
                  id
                }
              }
            }
  				}
  			}
  		`;
      expect.assertions(2);
      return graphql(schema, noCursorQuery)
        .then(result => {
          expect(result).toMatchSnapshot();
          return graphql(schema, cursorQuery);
        })
        .then(result => {
          expect(result).toMatchSnapshot();
        });
    });
  });

  it.skip('fetches a users communities');
  it.skip("fetches a user's channels");
});
