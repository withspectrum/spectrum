// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment, {
  type ChannelInfoType,
} from '../../fragments/channel/channelInfo';

export type DisableChannelTokenJoinType = {
  data: {
    channel: {
      ...$Exact<ChannelInfoType>,
      joinSettings: {
        tokenJoinEnabled: boolean,
        token: string,
      },
    },
  },
};

export const disableChannelTokenJoinMutation = gql`
  mutation disableChannelTokenJoin($input: DisableChannelTokenJoinInput!) {
    disableChannelTokenJoin(input: $input) {
      ...channelInfo
      joinSettings {
        tokenJoinEnabled
        token
      }
    }
  }
  ${channelInfoFragment}
`;

const disableChannelTokenJoinOptions = {
  props: ({ mutate }) => ({
    disableChannelTokenJoin: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  disableChannelTokenJoinMutation,
  disableChannelTokenJoinOptions
);
