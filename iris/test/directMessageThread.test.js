// @flow
import { request } from './utils';
import data from 'shared/testing/data';
import { toPlainText, toState } from 'shared/draft-utils';

const messageToPlainText = message =>
  toPlainText(toState(JSON.parse(message.content.body)));

const context = {
  user: data.users.find(({ username }) => username === 'mxstbr'),
};

// All the messages in the test DM thread ordered by time, desc
const messages = data.messages
  .filter(({ threadId }) => threadId === 'dm-1')
  .sort((a, b) => a.timestamp - b.timestamp);

it('should fetch a directMessageThread', async () => {
  const query = /* GraphQL */ `
    {
      directMessageThread(id: "dm-1") {
        id
        threadLastActive
      }
    }
  `;

  expect.assertions(1);
  const result = await request(query, { context });

  expect(result).toMatchSnapshot();
});

describe('messageConnection', () => {
  it('should fetch a directMessageThreads messages', async () => {
    const query = /* GraphQL */ `
      {
        directMessageThread(id: "dm-1") {
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
    const result = await request(query, { context });

    expect(result).toMatchSnapshot();
  });

  it('should fetch the last message first', async () => {
    const query = /* GraphQL */ `
      {
        directMessageThread(id: "dm-1") {
          messageConnection(first: 1) {
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
            edges {
              node {
                id
                content {
                  body
                }
              }
            }
          }
        }
      }
    `;

    expect.assertions(2);
    const result = await request(query, { context });

    expect(result.data.directMessageThread.messageConnection.pageInfo).toEqual({
      hasNextPage: true,
      hasPreviousPage: false,
    });

    expect(
      messageToPlainText(
        result.data.directMessageThread.messageConnection.edges[0].node
      )
    ).toEqual(messageToPlainText(messages[messages.length - 1]));
  });

  it('should fetch the second to last message next', async () => {
    // Get the first message, same as above
    const query = /* GraphQL */ `
      {
        directMessageThread(id: "dm-1") {
          messageConnection(first: 1) {
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
            edges {
              cursor
            }
          }
        }
      }
    `;

    expect.assertions(3);
    const result = await request(query, { context });

    // Get the cursor of the first message
    // Make sure pageInfo is calculated correctly
    expect(result.data.directMessageThread.messageConnection.pageInfo).toEqual({
      hasNextPage: true,
      hasPreviousPage: false,
    });

    const cursor =
      result.data.directMessageThread.messageConnection.edges[0].cursor;

    // Generate a query of the first message after the cursor of the last message
    const nextQuery = /* GraphQL */ `
      {
        directMessageThread(id: "dm-1") {
          messageConnection(first: 1, after: "${cursor}") {
            pageInfo {
              hasNextPage
              hasPreviousPage
            }
            edges {
              node {
                content {
                  body
                }
              }
            }
          }
        }
      }
    `;

    const nextResult = await request(nextQuery, { context });

    expect(
      nextResult.data.directMessageThread.messageConnection.pageInfo
    ).toEqual({
      hasNextPage: true,
      hasPreviousPage: true,
    });

    expect(
      messageToPlainText(
        nextResult.data.directMessageThread.messageConnection.edges[0].node
      )
    ).toEqual(messageToPlainText(messages[messages.length - 2]));
  });
});
