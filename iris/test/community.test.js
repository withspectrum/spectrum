// @flow
import { request } from './utils';

it('should fetch a community', () => {
  const query = /* GraphQL */ `
    {
      community(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a191") {
        id
        createdAt
        slug
        description
        website
        profilePhoto
        coverPhoto
      }
    }
  `;

  expect.assertions(1);
  return request(query).then(result => {
    expect(result).toMatchSnapshot();
  });
});

it('should fetch a communities threads', () => {
  const query = /* GraphQL */ `
    {
      community(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a191") {
        threadConnection {
          edges {
            node {
              content {
                title
              }
            }
          }
        }
      }
    }
  `;

  expect.assertions(1);
  return request(query).then(result => {
    expect(result).toMatchSnapshot();
  });
});
