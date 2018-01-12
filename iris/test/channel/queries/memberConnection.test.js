//@flow
import { request } from '../../utils';

it('should fetch a channels member connection', () => {
  const query = /* GraphQL */ `
    {
      channel(id: "ce2b4488-4c75-47e0-8ebc-2539c1e6a192") {
        id
        memberConnection(after: null) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              id
              name
              contextPermissions {
                communityId
                reputation
              }
            }
          }
        }
      }
    }
  `;

  expect.assertions(1);
  return request(query).then(result => {
    console.log(result.errors);
    expect(result).toMatchSnapshot();
  });
});
