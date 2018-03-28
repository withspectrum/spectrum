//@flow
import { request } from '../../utils';
import { SPECTRUM_GENERAL_CHANNEL_ID } from '../../../migrations/seed/default/constants';

it('should fetch a channels blocked users', async () => {
  const query = /* GraphQL */ `
    {
      channel(id: "${SPECTRUM_GENERAL_CHANNEL_ID}") {
        id
        blockedUsers {
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
  const result = await request(query);

  expect(result).toMatchSnapshot();
});
