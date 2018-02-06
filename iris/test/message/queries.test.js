// @flow
import { request } from '../utils';
import data from 'shared/testing/data';

it('should fetch a message', async () => {
  const query = /* GraphQL */ `
    {
      message(id: "${data.messages[0].id}") {
        id
        timestamp
        content {
          body
        }
        messageType
      }
    }
  `;

  expect.hasAssertions();
  const result = await request(query);

  expect(result).toMatchSnapshot();
});

describe('sender', () => {
  it('should fetch a user', async () => {
    const query = /* GraphQL */ `
      {
        message(id: "${data.messages[0].id}") {
          author {
            id
            user { 
              username
            }
          }
        }
      }
    `;

    expect.hasAssertions();
    const result = await request(query);
    expect(result).toMatchSnapshot();
  });
});
