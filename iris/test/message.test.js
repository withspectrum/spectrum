// @flow
import { request } from './utils';

it('should fetch a message', async () => {
  const query = /* GraphQL */ `
    {
      message(id: "0063e9e6-8960-4dd4-96ab-f18bca4cf75f") {
        id
        timestamp
        content {
          body
        }
        messageType
      }
    }
  `;

  expect.assertions(1);
  const result = await request(query);

  expect(result).toMatchSnapshot();
});
