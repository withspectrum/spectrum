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
  .filter(({ threadId }) => threadId === 'first-dm-thread-asdf123')
  .sort((a, b) => a.timestamp - b.timestamp);

it('should fetch a directMessageThread', () => {
  const query = /* GraphQL */ `
    {
      directMessageThread(id: "first-dm-thread-asdf123") {
        id
        threadLastActive
      }
    }
  `;

  expect.assertions(1);
  return request(query, { context }).then(result => {
    expect(result).toMatchSnapshot();
  });
});

describe('messageConnection', () => {
  it('should fetch a directMessageThreads messages', () => {
    const query = /* GraphQL */ `
      {
        directMessageThread(id: "first-dm-thread-asdf123") {
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
    return request(query, { context }).then(result => {
      expect(result).toMatchSnapshot();
    });
  });

  it('should fetch the last message first', () => {
    const query = /* GraphQL */ `
      {
        directMessageThread(id: "first-dm-thread-asdf123") {
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
    return request(query, { context }).then(result => {
      expect(
        result.data.directMessageThread.messageConnection.pageInfo
      ).toEqual({
        hasNextPage: true,
        hasPreviousPage: false,
      });
      expect(
        messageToPlainText(
          result.data.directMessageThread.messageConnection.edges[0].node
        )
      ).toEqual(messageToPlainText(messages[messages.length - 1]));
    });
  });

  it('should fetch the second to last message next', () => {
    // Get the first message, same as above
    const query = /* GraphQL */ `
      {
        directMessageThread(id: "first-dm-thread-asdf123") {
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
    return (
      request(query, { context })
        // Get the cursor of the first message
        .then(result => {
          // Make sure pageInfo is calculated correctly
          expect(
            result.data.directMessageThread.messageConnection.pageInfo
          ).toEqual({
            hasNextPage: true,
            hasPreviousPage: false,
          });
          return result.data.directMessageThread.messageConnection.edges[0]
            .cursor;
        })
        .then(cursor => {
          // Generate a query of the first message after the cursor of the last message
          const nextQuery = /* GraphQL */ `
          {
            directMessageThread(id: "first-dm-thread-asdf123") {
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
          return request(nextQuery, { context });
        })
        .then(result => {
          expect(
            result.data.directMessageThread.messageConnection.pageInfo
          ).toEqual({
            hasNextPage: true,
            hasPreviousPage: true,
          });
          expect(
            messageToPlainText(
              result.data.directMessageThread.messageConnection.edges[0].node
            )
          ).toEqual(messageToPlainText(messages[messages.length - 2]));
        })
    );
  });
});
