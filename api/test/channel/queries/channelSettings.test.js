//@flow
import { request } from '../../utils';
import data from 'shared/testing/data';
import {
  SPECTRUM_GENERAL_CHANNEL_ID,
  CHANNEL_MODERATOR_USER_ID,
} from '../../../migrations/seed/default/constants';

const channelModerator = data.users.find(
  ({ id }) => id === CHANNEL_MODERATOR_USER_ID
);

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
  const result = await request(query, { context: { user: channelModerator } });
  const {
    data: { channel },
  } = result;

  expect(channel.joinSettings.tokenJoinEnabled).toEqual(false);
  expect(channel.joinSettings.token).toEqual(null);
  expect(result).toMatchSnapshot();
});
