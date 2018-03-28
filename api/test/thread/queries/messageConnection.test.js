// @flow
import { request } from '../../utils';
import data from 'shared/testing/data';
import { toPlainText, toState } from 'shared/draft-utils';

const messageToPlainText = message =>
  toPlainText(toState(JSON.parse(message.content.body)));

// Get all messages in our test thread and sort them by time
const messages = data.messages
  .filter(({ threadId }) => threadId === 'thread-1')
  .sort((a, b) => a.timestamp - b.timestamp);

describe('messageConnection', () => {
  it('should fetch a threads messages', async () => {
    const query = /* GraphQL */ `
      {
        thread(id: "thread-1") {
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

    expect.hasAssertions();
    const result = await request(query);
    expect(result.data.thread.messageConnection.edges).toHaveLength(
      messages.length
    );
    expect(result).toMatchSnapshot();
  });

  it('should fetch the first message first', async () => {
    const query = /* GraphQL */ `
      {
        thread(id: "thread-1") {
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

    expect.hasAssertions();
    const result = await request(query);

    expect(result.data.thread.messageConnection.edges).toHaveLength(1);

    expect(result.data.thread.messageConnection.pageInfo).toEqual({
      // This is true if there is more messages than this one
      hasNextPage: messages.length > 1,
      // This has to be false since it's the first message
      hasPreviousPage: false,
    });

    expect(
      messageToPlainText(result.data.thread.messageConnection.edges[0].node)
    ).toEqual(messageToPlainText(messages[0]));
  });

  it('should fetch the second message next', async () => {
    // Get the cursor of the first message
    const query = /* GraphQL */ `
      {
        thread(id: "thread-1") {
          messageConnection(first: 1) {
            edges {
              cursor
            }
          }
        }
      }
    `;

    expect.hasAssertions();
    const result = await request(query);
    const cursor = result.data.thread.messageConnection.edges[0].cursor;

    // Get one message after the cursor of the first message
    // i.e. the second message
    const nextQuery = /* GraphQL */ `
      {
        thread(id: "thread-1") {
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

    const nextResult = await request(nextQuery);

    expect(nextResult.data.thread.messageConnection.edges).toHaveLength(1);

    expect(nextResult.data.thread.messageConnection.pageInfo).toEqual({
      hasNextPage: messages.length > 2,
      // We know this has a previous page
      hasPreviousPage: true,
    });

    expect(
      messageToPlainText(nextResult.data.thread.messageConnection.edges[0].node)
    ).toEqual(messageToPlainText(messages[1]));
  });

  it('should correctly set pageInfo when more messages are requested than are available', async () => {
    // Request more messages than there are
    const query = /* GraphQL */ `
      {
        thread(id: "thread-1") {
          messageConnection(first: ${messages.length + 1}) {
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

    expect.hasAssertions();
    const result = await request(query);
    const { edges, pageInfo } = result.data.thread.messageConnection;

    expect(edges).toHaveLength(messages.length);

    expect(pageInfo).toEqual({
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });

  it('should correctly set pageInfo when all messages are requested', async () => {
    // Request more messages than there are
    const query = /* GraphQL */ `
      {
        thread(id: "thread-1") {
          messageConnection(first: ${messages.length}) {
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

    expect.hasAssertions();
    const result = await request(query);
    const { edges, pageInfo } = result.data.thread.messageConnection;

    expect(edges).toHaveLength(messages.length);

    expect(pageInfo).toEqual({
      hasNextPage: false,
      hasPreviousPage: false,
    });
  });

  it('should correctly set pageInfo when more messages are requested than are available after a cursor', async () => {
    // Get the cursor of the first message
    const query = /* GraphQL */ `
      {
        thread(id: "thread-1") {
          messageConnection(first: 1) {
            edges {
              cursor
            }
          }
        }
      }
    `;

    expect.hasAssertions();
    const result = await request(query);
    const cursor = result.data.thread.messageConnection.edges[0].cursor;

    // Get all messages after the cursor of the first message
    // but get more than are available
    const nextQuery = /* GraphQL */ `
      {
        thread(id: "thread-1") {
          messageConnection(first: ${messages.length}, after: "${cursor}") {
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

    const nextResult = await request(nextQuery);
    const { edges, pageInfo } = nextResult.data.thread.messageConnection;

    expect(edges).toHaveLength(messages.length - 1);
    expect(pageInfo).toEqual({
      hasNextPage: false,
      hasPreviousPage: true,
    });
  });
});
