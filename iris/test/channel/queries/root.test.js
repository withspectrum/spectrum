//@flow
import { request } from '../../utils';

it('should fetch a channel by id', async () => {
  const query = /* GraphQL */ `
    {
      channel(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a192") {
        id
        name
        slug
        description
        isPrivate
        createdAt
      }
    }
  `;

  expect.assertions(1);
  const result = await request(query);

  expect(result).toMatchSnapshot();
});

it('should fetch a channel by slug and community slug', async () => {
  const query = /* GraphQL */ `
    {
      channel(channelSlug: "general", communitySlug: "spectrum") {
        id
        name
        slug
        description
        isPrivate
        createdAt
      }
    }
  `;

  expect.assertions(1);
  const result = await request(query);

  expect(result).toMatchSnapshot();
});
