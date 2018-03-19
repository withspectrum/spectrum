//@flow
import { request } from '../../utils';

it('should fetch a private channels token join settings', async () => {
  const query = /* GraphQL */ `
    {
      channel(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a192") {
        id
        joinSettings {
          tokenJoinEnabled
          token
        }
      }
    }
  `;

  expect.assertions(3);
  const result = await request(query);
  const { data: { channel } } = result;

  expect(channel.joinSettings.tokenJoinEnabled).toEqual(false);
  expect(channel.joinSettings.token).toEqual(null);
  expect(result).toMatchSnapshot();
});
