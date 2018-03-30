//@flow
import { request } from '../../utils';
import { SPECTRUM_GENERAL_CHANNEL_ID } from '../../../migrations/seed/default/constants';

it('should fetch a channels member connection', async () => {
  const query = /* GraphQL */ `
    {
      channel(id: "${SPECTRUM_GENERAL_CHANNEL_ID}") {
        id
        memberConnection(after: null) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              id
              name
              contextPermissions {
                communityId
                reputation
              }
            }
          }
        }
      }
    }
  `;

  expect.assertions(1);
  const result = await request(query);

  expect(result).toMatchSnapshot();
});
