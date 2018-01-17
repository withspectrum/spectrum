import { request } from './utils';

describe('queries', () => {
  it('should fetch a user', async () => {
    const query = /* GraphQL */ `
			{
				user(id: "gVk5mYwccUOEKiN5vtOouqroGKo1") {
          id
          name
          description
          website
          username
          email
          providerId
          createdAt
				}
			}
		`;

    expect.assertions(1);
    const result = await request(query);

    expect(result).toMatchSnapshot();
  });

  it('should return null for a non-existant id', async () => {
    const query = /* GraphQL */ `
			{
				user(id: "non-existant") {
					id
          username
				}
			}
		`;

    expect.assertions(1);
    const result = await request(query);

    expect(result).toMatchSnapshot();
  });

  it('should fetch a users communities', async () => {
    const query = /* GraphQL */ `
      {
        user(id: "gVk5mYwccUOEKiN5vtOouqroGKo1") {
          communityConnection {
            edges {
              node {
                name
              }
            }
          }
        }
      }
    `;

    expect.assertions(1);
    const result = await request(query);

    expect(result).toMatchSnapshot();
  });

  describe.skip('everything', () => {
    it('should return the latest thread', async () => {
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
      const result = await graphql(schema, query);

      expect(result).toMatchSnapshot();
    });

    it('should paginate based on the after property', async () => {
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
      const result = await graphql(schema, query);

      expect(result).toMatchSnapshot();
    });

    it('should handle first being set to 0 correctly', async () => {
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
      const result = await graphql(schema, noCursorQuery);

      expect(result).toMatchSnapshot();

      const nextResult = await graphql(schema, cursorQuery);

      expect(nextResult).toMatchSnapshot();
    });
  });
});
