// @flow
import gql from 'graphql-tag';

export type ChannelMetaDataType = {
  metaData: {
    members: number,
  },
};

export default gql`
  fragment channelMetaData on Channel {
    metaData {
      members
    }
  }
`;
