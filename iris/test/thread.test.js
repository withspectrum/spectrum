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

  it('should fetch the first message first', () => {
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

    expect.assertions(2);
    return request(query).then(result => {
      expect(result.data.thread.messageConnection.pageInfo).toEqual({
        hasNextPage: true,
        hasPreviousPage: false,
      });
      expect(
        messageToPlainText(result.data.thread.messageConnection.edges[0].node)
      ).toEqual(messageToPlainText(messages[0]));
    });
  });

  it('should fetch the second message next', () => {
    // Get the first message, same as above
    const query = /* GraphQL */ `
      {
        thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
          messageConnection(first: 1) {
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

    expect.assertions(4);
    return (
      request(query)
        // Get the cursor of the first message
        .then(result => {
          // Make sure pageInfo is calculated correctly
          expect(result.data.thread.messageConnection.pageInfo).toEqual({
            hasNextPage: true,
            hasPreviousPage: false,
          });
          expect(
            messageToPlainText(
              result.data.thread.messageConnection.edges[0].node
            )
          ).toEqual(messageToPlainText(messages[0]));
          return result.data.thread.messageConnection.edges[0].cursor;
        })
        .then(cursor => {
          // Generate a query of the first message after the cursor of the last message
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
          return request(nextQuery);
        })
        .then(result => {
          expect(result.data.thread.messageConnection.pageInfo).toEqual({
            hasNextPage: true,
            hasPreviousPage: true,
          });
          expect(
            messageToPlainText(
              result.data.thread.messageConnection.edges[0].node
            )
          ).toEqual(messageToPlainText(messages[1]));
        })
    );
  });
});
