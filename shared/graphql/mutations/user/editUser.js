// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';
import type { EditUserInput } from 'shared/db/queries/user';
import { getUserByUsernameQuery } from '../../queries/user/getUser';

export type EditUserType = {
  ...$Exact<UserInfoType>,
};

export type EditUserProps = {
  editUser: (
    input: $PropertyType<EditUserInput, 'input'>
  ) => Promise<EditUserType>,
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
  options: {
    refetchQueries: ['getCurrentUser'],
  },
  props: ({ mutate }) => ({
    editUser: input =>
      mutate({
        variables: {
          input,
        },
        refetchQueries: [
          {
            query: getUserByUsernameQuery,
            variables: {
              id: input.username,
            },
          },
        ],
      }),
  }),
};

export default graphql(editUserMutation, editUserOptions);
