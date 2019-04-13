// @flow
import gql from 'graphql-tag';

export type ChannelMetaDataType = {
  metaData: {
    members: number,
    onlineMembers: number,
  },
};

export default gql`
  fragment channelMetaData on Channel {
    metaData {
      members
      onlineMembers
    }
  }
`;
