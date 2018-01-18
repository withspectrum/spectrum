// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import userInfoFragment from '../../fragments/user/userInfo';
import channelMetaDataFragment from '../../fragments/channel/channelMetaData';
import getChannelMemberConnectionQuery from '../../queries/channel/getChannelMemberConnection';

type UnblockInput = {
  channelId: string,
  userId: string,
};

const unblockChannelBlockedUserMutation = gql`
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
  props: ({ input, mutate }) => ({
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
