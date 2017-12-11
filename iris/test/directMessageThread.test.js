// @flow
import { request } from './utils';
import data from 'shared/testing/data';

const context = {
  user: data.users.find(({ username }) => username === 'mxstbr'),
};

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
});
