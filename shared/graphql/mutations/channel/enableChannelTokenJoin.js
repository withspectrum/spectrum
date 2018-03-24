// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import channelInfoFragment, {
  type ChannelInfoType,
} from '../../fragments/channel/channelInfo';

export type EnableChannelTokenJoinType = {
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

export const enableChannelTokenJoinMutation = gql`
  mutation enableChannelTokenJoin($input: EnableChannelTokenJoinInput!) {
    enableChannelTokenJoin(input: $input) {
      ...channelInfo
      joinSettings {
        tokenJoinEnabled
        token
      }
    }
  }
  ${channelInfoFragment}
`;

const enableChannelTokenJoinOptions = {
  props: ({ mutate }) => ({
    enableChannelTokenJoin: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  enableChannelTokenJoinMutation,
  enableChannelTokenJoinOptions
);
