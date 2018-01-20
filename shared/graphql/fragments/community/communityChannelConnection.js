// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import channelMetaDataFragment from '../../fragments/channel/channelMetaData';

export default gql`
  fragment communityChannelConnection on Community {
    channelConnection {
      edges {
        node {
          ...channelInfo
        }
      }
    }
  }
  ${channelInfoFragment}
`;
