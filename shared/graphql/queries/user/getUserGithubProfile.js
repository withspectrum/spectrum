// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

type Profile = {
  id: string,
  username: string,
};

export type GetUserGithbProfileType = {
  id: string,
  username: string,
  githubProfile: ?Profile,
};

export const getUserGithubProfileQuery = gql`
  query getUserGithubProfile($id: ID) {
    user(id: $id) {
      id
      username
      githubProfile {
        id
        username
      }
    }
  }
`;

const getUserGithubProfileOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};
export default graphql(getUserGithubProfileQuery, getUserGithubProfileOptions);
