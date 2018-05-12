// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';

export const updateUserStatusMutation = gql`
  mutation updateUserStatus($status: LowercaseString!) {
    updateUserStatus(status: $status) {
      ...userInfo
    }
  }
  ${userInfoFragment}
`;

const userStatusOptions = {
  props: ({ mutate }) => ({
    updateStatus: status =>
      mutate({
        variables: {
          status,
        },
      }),
  }),
};

export default graphql(updateUserStatusMutation, userStatusOptions);
