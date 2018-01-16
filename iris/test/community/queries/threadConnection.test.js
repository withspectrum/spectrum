// @flow
import { request } from '../../utils';
import { threads, communities } from 'shared/testing/data';

const community = communities[0];

it('should fetch a communities threads', async () => {
  const query = /* GraphQL */ `
    {
      community(id: "${community.id}") {
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

  expect.hasAssertions();
  const result = await request(query);

  expect(result).toMatchSnapshot();
});

it('should fetch a communities threads in lastActive order', async () => {
  const query = /* GraphQL */ `
    {
      community(id: "${community.id}") {
        threadConnection {
          edges {
            node {
              lastActive
              id
            }
          }
        }
      }
    }
  `;

  expect.hasAssertions();
  const result = await request(query);

  // Expect the manually by lastActive sorted result to equal the original result
  expect(
    result.data.community.threadConnection.edges.sort(
      (a, b) =>
        new Date(a.node.lastActive).getTime() - new Date(b.lastActive).getTime()
    )
  ).toEqual(result.data.community.threadConnection.edges);
});

describe('pagination', () => {
  it('should paginate threads', async () => {
    expect.hasAssertions();
    const query = /* GraphQL */ `
      {
        community(id: "${community.id}") {
          threadConnection(first: 1) {
            edges {
              cursor
              node {
                lastActive
                id
              }
            }
          }
        }
      }
    `;

    const firstThread = await request(query);

    expect(firstThread.data.community.threadConnection.edges.length).toEqual(1);
    expect(firstThread).toMatchSnapshot();

    // Construct a query with the cursor of the first thread
    const secondQuery = /* GraphQL */ `
      {
        community(id: "${community.id}") {
          threadConnection(first: 1, after: "${
            firstThread.data.community.threadConnection.edges[0].cursor
          }") {
            edges {
              cursor
              node {
                lastActive
                id
              }
            }
          }
        }
      }
    `;

    const secondThread = await request(secondQuery);

    expect(secondThread).not.toEqual(firstThread);
    expect(
      new Date(
        secondThread.data.community.threadConnection.edges[0].node.lastActive
      ).getTime()
    ).toBeLessThan(
      new Date(
        firstThread.data.community.threadConnection.edges[0].node.lastActive
      ).getTime()
    );
    expect(secondThread).toMatchSnapshot();
  });

  it('should be able to reverse paginate threads', async () => {
    expect.hasAssertions();
    const query = /* GraphQL */ `
      {
        community(id: "${community.id}") {
          threadConnection(last: 1) {
            edges {
              cursor
              node {
                lastActive
                id
              }
            }
          }
        }
      }
    `;

    const lastThread = await request(query);

    expect(lastThread.data.community.threadConnection.edges.length).toEqual(1);
    expect(lastThread).toMatchSnapshot();

    // Construct a query with the cursor of the last thread
    const secondQuery = /* GraphQL */ `
      {
        community(id: "${community.id}") {
          threadConnection(last: 1, before: "${
            lastThread.data.community.threadConnection.edges[0].cursor
          }") {
            edges {
              cursor
              node {
                lastActive
                id
              }
            }
          }
        }
      }
    `;

    const secondThread = await request(secondQuery);

    expect(secondThread).not.toEqual(lastThread);
    expect(
      new Date(
        secondThread.data.community.threadConnection.edges[0].node.lastActive
      ).getTime()
    ).toBeGreaterThan(
      new Date(
        lastThread.data.community.threadConnection.edges[0].node.lastActive
      ).getTime()
    );
    expect(secondThread).toMatchSnapshot();
  });
});
