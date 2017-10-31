import { request } from './utils';

describe('queries', () => {
  it('should fetch a user', () => {
    const query = /* GraphQL */ `
			{
				user(id: "gVk5mYwccUOEKiN5vtOouqroGKo1") {
          id
          name
          description
          website
          username
          profilePhoto
          coverPhoto
          email
          providerId
          createdAt
          lastSeen
				}
			}
		`;

    expect.assertions(1);
    return request(query).then(result => {
      expect(result).toMatchSnapshot();
    });
  });

  it('should return null for a non-existant id', () => {
    const query = /* GraphQL */ `
			{
				user(id: "non-existant") {
					id
          username
				}
			}
		`;

    expect.assertions(1);
    return request(query).then(result => {
      expect(result).toMatchSnapshot();
    });
  });

  describe.skip('everything', () => {
    it('should return the latest thread', () => {
      const query = /* GraphQL */ `
  			{
  				user(id: "gVk5mYwccUOEKiN5vtOouqroGKo1") {
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
  				user(id: "gVk5mYwccUOEKiN5vtOouqroGKo1") {
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
  				user(id: "gVk5mYwccUOEKiN5vtOouqroGKo1") {
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
  				user(id: "gVk5mYwccUOEKiN5vtOouqroGKo1") {
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
});
