// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import userInfoFragment from '../../fragments/user/userInfo';
import channelMetaDataFragment from '../../fragments/channel/channelMetaData';
import getChannelMemberConnectionQuery from '../../queries/channel/getChannelMemberConnection';

type TogglePendingInput = {
  channelId: string,
  userId: string,
  action: 'approve' | 'block',
};

const toggleChannelPendingUserMutation = gql`
  mutation togglePendingUser($input: TogglePendingUserInput!) {
    togglePendingUser(input: $input) {
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

const toggleChannelPendingUserOptions = {
  props: ({ input, mutate }) => ({
    togglePendingUser: (input: TogglePendingInput) =>
      mutate({
        variables: {
          input,
        },
        refetchQueries: [
          {
            query: getChannelMemberConnectionQuery,
            variables: {
              id: input.channelId,
            },
          },
        ],
      }),
  }),
};

export default graphql(
  toggleChannelPendingUserMutation,
  toggleChannelPendingUserOptions
);
