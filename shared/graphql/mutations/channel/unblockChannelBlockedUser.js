// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import type { ChannelInfoType } from '../../fragments/channel/channelInfo';
import userInfoFragment from '../../fragments/user/userInfo';
import type { UserInfoType } from '../../fragments/user/userInfo';
import channelMetaDataFragment from '../../fragments/channel/channelMetaData';
import type { ChannelMetaDataType } from '../../fragments/channel/channelMetaData';

type User = {
  ...$Exact<UserInfoType>,
};

export type UnblockChannelBlockedUserType = {
  data: {
    unblockUser: {
      ...$Exact<ChannelInfoType>,
      pendingUsers: Array<?User>,
      blockedUsers: Array<?User>,
      channelMetaData: {
        ...$Exact<ChannelMetaDataType>,
      },
    },
  },
};

type UnblockInput = {
  channelId: string,
  userId: string,
};

export const unblockChannelBlockedUserMutation = gql`
  mutation unblockUser($input: UnblockUserInput!) {
    unblockUser(input: $input) {
      ...channelInfo
      pendingUsers {
        ...userInfo
      }
      blockedUsers {
        ...userInfo
      }
      ...channelMetaData
    }
  }
  ${channelInfoFragment}
  ${userInfoFragment}
  ${channelMetaDataFragment}
`;

const unblockChannelBlockedUserOptions = {
  props: ({ mutate }) => ({
    unblockUser: (input: UnblockInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  unblockChannelBlockedUserMutation,
  unblockChannelBlockedUserOptions
);
