// @flow
import { request } from './utils';
import { SPECTRUM_COMMUNITY_ID } from '../migrations/seed/default/constants';

it('should fetch a community', async () => {
  const query = /* GraphQL */ `
    {
      community(id: "${SPECTRUM_COMMUNITY_ID}") {
        id
        createdAt
        name
        slug
        description
        website
      }
    }
  `;

  expect.assertions(1);
  const result = await request(query);

  expect(result).toMatchSnapshot();
});

it('should fetch a communities threads', async () => {
  const query = /* GraphQL */ `
    {
      community(id: "${SPECTRUM_COMMUNITY_ID}") {
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
  const result = await request(query);

  expect(result).toMatchSnapshot();
});

it('should fetch a list of communities', async () => {
  const query = /* GraphQL */ `
    {
      communities(slugs: ["spectrum"]) {
        id
        createdAt
        slug
        description
        website
      }
    }
  `;

  expect.assertions(1);
  const result = await request(query);

  expect(result).toMatchSnapshot();
});

it('should fetch a list of community members', async () => {
  const query = /* GraphQL */ `
    {
      community(id: "${SPECTRUM_COMMUNITY_ID}") {
        id
        members {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              user {
                id
              }
              reputation
              isOwner
              isModerator
              isMember
              isBlocked
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
