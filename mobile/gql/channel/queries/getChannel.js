// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import channelInfoFragment from 'shared/graphql/fragments/channel/channelInfo';
import channelMetaDataFragment from 'shared/graphql/fragments/channel/channelMetaData';

export const getChannelByIdQuery = gql`
  query getChannel($id: ID) {
    channel(id: $id) {
      ...channelInfo
      ...channelMetaData
    }
  }
  ${channelInfoFragment}
  ${channelMetaDataFragment}
`;

const getChannelByIdOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export default graphql(getChannelByIdQuery, getChannelByIdOptions);
