// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../../../shared/graphql/fragments/user/userInfo';

export const getUserByIdQuery = gql`
  query getUser($id: ID) {
    user(id: $id) {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;

const getUserByIdOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export default graphql(getUserByIdQuery, getUserByIdOptions);
