//@flow
import { request } from '../../utils';

it('should fetch a channel by id', () => {
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
  return request(query).then(result => {
    expect(result).toMatchSnapshot();
  });
});

it('should fetch a channel by slug and community slug', () => {
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
  return request(query).then(result => {
    expect(result).toMatchSnapshot();
  });
});
