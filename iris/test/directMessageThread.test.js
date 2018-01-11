// @flow
import { request } from './utils';

it('should fetch a direct message thread', () => {
  const query = /* GraphQL */ `
    {
      directMessageThread(id: "first-dm-thread-asfd123") {
        id
        snippet
        threadLastActive
      }
    }
  `;

  expect.assertions(1);
  return request(query).then(result => {
    expect(result).toMatchSnapshot();
  });
});
