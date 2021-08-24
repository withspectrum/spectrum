//@flow
import { request } from '../../utils';
import { SPECTRUM_COMMUNITY_ID } from '../../../migrations/seed/default/constants';

it('should fetch a communitys settings', async () => {
  const query = /* GraphQL */ `
    {
      community(id: "${SPECTRUM_COMMUNITY_ID}") {
        id
      }
    }
  `;

  expect.assertions(1);
  const result = await request(query);
  expect(result).toMatchSnapshot();
});
