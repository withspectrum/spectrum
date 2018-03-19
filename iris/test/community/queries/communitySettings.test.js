//@flow
import { request } from '../../utils';

it('should fetch a communitys settings', async () => {
  const query = /* GraphQL */ `
    {
      community(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a191") {
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
