// @flow
import { request } from './utils';

it('should fetch a thread', () => {
  const query = /* GraphQL */ `
    {
      thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
        id
        createdAt
        modifiedAt
        lastActive
        isPublished
        isLocked
        type
        content {
          title
        }
      }
    }
  `;

  expect.assertions(1);
  return request(query).then(result => {
    expect(result).toMatchSnapshot();
  });
});

describe('messageConnection', () => {
  it('should fetch a threads messages', () => {
    const query = /* GraphQL */ `
      {
        thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
          messageConnection(first: 999999) {
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
    return request(query).then(result => {
      expect(result).toMatchSnapshot();
    });
  });
});
