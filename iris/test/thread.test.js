// @flow
import { request } from './utils';
import data from 'shared/testing/data';
import { toPlainText, toState } from 'shared/draft-utils';

const messageToPlainText = message =>
  toPlainText(toState(JSON.parse(message.content.body)));

// Get all messages in our test thread and sort them by time
const messages = data.messages
  .filter(({ threadId }) => threadId === 'ce2b4488-4c75-47e0-8ebc-2539c1e6a193')
  .sort((a, b) => a.timestamp - b.timestamp);

it('should fetch a thread', async () => {
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

  expect.hasAssertions();
  const result = await request(query);

  expect(result).toMatchSnapshot();
});

describe('messageConnection', () => {
  it('should fetch a threads messages', async () => {
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
        thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
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
        thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
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
        thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
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
        thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
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
        thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
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
        thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
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
        thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
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

describe('reverse pagination', () => {
  it('should fetch with reverse pagination', async () => {
    // Get the first three messages
    const query = /* GraphQL */ `
        {
          thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
            messageConnection(first: 3) {
              pageInfo {
                hasNextPage
                hasPreviousPage
              }
              edges {
                cursor
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

    expect.hasAssertions();
    const result = await request(query);

    // Get the cursor of the first message
    const { edges, pageInfo } = result.data.thread.messageConnection;

    expect(edges).toHaveLength(3);

    // Make sure pageInfo is calculated correctly
    expect(pageInfo).toEqual({
      hasNextPage: messages.length > 3,
      // We know this can't have a previous page since we fetched the very first one
      hasPreviousPage: false,
    });

    // Make sure we got the right messages
    edges.forEach(({ node }, index) => {
      expect(messageToPlainText(node)).toEqual(
        messageToPlainText(messages[index])
      );
    });

    // Return the cursor of the last message
    const cursor = edges[2].cursor;

    // Get one message before the last message of the first page we just got
    const nextQuery = /* GraphQL */ `
      {
        thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
          messageConnection(last: 1, before: "${cursor}") {
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

    expect(nextResult.data.thread.messageConnection.pageInfo).toEqual({
      // We know there's more messages on either side of this one
      hasNextPage: true,
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
        thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
          messageConnection(last: ${messages.length + 1}) {
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
        thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
          messageConnection(last: ${messages.length}) {
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
    // Get the cursor of the last message
    const query = /* GraphQL */ `
      {
        thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
          messageConnection(last: 1) {
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

    // Get all messages after the cursor of the last message
    // but get more than are available
    const nextQuery = /* GraphQL */ `
      {
        thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
          messageConnection(last: ${messages.length}, before: "${cursor}") {
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
    expect(nextResult.data.thread.messageConnection.edges).toHaveLength(
      messages.length - 1
    );
    expect(nextResult.data.thread.messageConnection.pageInfo).toEqual({
      hasNextPage: true,
      hasPreviousPage: false,
    });
  });
});
