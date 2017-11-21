// @flow
import { request } from './utils';

it('should fetch a channel', () => {
  const query = /* GraphQL */ `
    {
      channel(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a192") {
        id
        createdAt
        modifiedAt
        name
        slug
        description
        isPrivate
        isDefault
      }
    }
  `;

  expect.assertions(1);
  return request(query).then(result => {
    expect(result).toMatchSnapshot();
  });
});
