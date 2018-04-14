// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';

export type UpdateUserEmailType = {
  data: {
    updateUserEmail: {
      ...$Exact<UserInfoType>,
      email: ?string,
      pendingEmail: ?string,
    },
  },
};

export const updateUserEmailMutation = gql`
  mutation updateUserEmail($email: LowercaseString!) {
    updateUserEmail(email: $email) {
      ...userInfo
      email
      pendingEmail
    }
  }
  ${userInfoFragment}
`;

const updateUserEmailOptions = {
  props: ({ mutate }) => ({
    updateUserEmail: (email: string) =>
      mutate({
        variables: {
          email,
        },
      }),
  }),
};

export default graphql(updateUserEmailMutation, updateUserEmailOptions);
