//@flow
import { request } from '../../utils';

it('should fetch a channels pending users', () => {
  const query = /* GraphQL */ `
    {
      channel(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a192") {
        id
        pendingUsers {
          id
          profilePhoto
          coverPhoto
          name
          firstName
          description
          website
          username
          isOnline
          timezone
        }
      }
    }
  `;

  expect.assertions(1);
  return request(query).then(result => {
    expect(result).toMatchSnapshot();
  });
});
