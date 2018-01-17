// @flow
import { request } from '../../utils';

it('should fetch a thread', async () => {
  const query = /* GraphQL */ `
    {
      thread(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a193") {
        id
        createdAt
        modifiedAt
        lastActive
        isPublished
        isLocked
        type
        content {
          title
        }
      }
    }
  `;

  expect.hasAssertions();
  const result = await request(query);

  expect(result).toMatchSnapshot();
});
