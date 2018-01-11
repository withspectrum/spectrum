// @flow
import { request } from './utils';

it('should fetch a thread', () => {
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
          body
        }
        attachments {
          attachmentType
          data
        }
        watercooler
      }
    }
  `;

  expect.assertions(1);
  return request(query).then(result => {
    expect(result).toMatchSnapshot();
  });
});
