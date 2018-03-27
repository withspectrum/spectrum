//@flow
import { request } from '../../utils';
import { SPECTRUM_GENERAL_CHANNEL_ID } from '../../../migrations/seed/default/constants';

it('should fetch a private channels token join settings', async () => {
  const query = /* GraphQL */ `
    {
      channel(id: "${SPECTRUM_GENERAL_CHANNEL_ID}") {
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
