// @flow
import { request } from '../../utils';

it('should fetch a thread', async () => {
  const query = /* GraphQL */ `
    {
      thread(id: "thread-1") {
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
