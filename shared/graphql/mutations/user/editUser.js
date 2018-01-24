// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';

export type EditUserType = {
  ...$Exact<UserInfoType>,
};

export const editUserMutation = gql`
  mutation editUser($input: EditUserInput!) {
    editUser(input: $input) {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;

const editUserOptions = {
  props: ({ input, mutate }) => ({
    editUser: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(editUserMutation, editUserOptions);
