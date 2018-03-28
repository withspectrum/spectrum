//@flow
import { request } from '../../utils';
import { SPECTRUM_COMMUNITY_ID } from '../../../migrations/seed/default/constants';

it('should fetch a communitys settings', async () => {
  const query = /* GraphQL */ `
    {
      community(id: "${SPECTRUM_COMMUNITY_ID}") {
        id
        brandedLogin {
          isEnabled
          message
        }
      }
    }
  `;

  expect.assertions(2);
  const result = await request(query);

  const { data: { community } } = result;

  expect(community.brandedLogin.isEnabled).toEqual(false);
  expect(result).toMatchSnapshot();
});
