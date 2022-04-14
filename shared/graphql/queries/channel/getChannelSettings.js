// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import channelInfoFragment, {
  type ChannelInfoType,
} from '../../fragments/channel/channelInfo';

export type GetChannelSettingsType = {
  ...$Exact<ChannelInfoType>,
  joinSettings: {
    tokenJoinEnabled: boolean,
    token: string,
  },
};

export const getChannelSettingsByIdQuery = gql`
  query getChannelSettings($id: ID) {
    channel(id: $id) {
      ...channelInfo
      joinSettings {
        tokenJoinEnabled
        token
      }
    }
  }
  ${channelInfoFragment}
`;

const getChannelSettingsByIdOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
    fetchPolicy: 'cache-first',
  }),
};

export default graphql(
  getChannelSettingsByIdQuery,
  getChannelSettingsByIdOptions
);
