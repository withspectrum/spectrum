// @flow
import gql from 'graphql-tag';
import userInfoFragment from '../../fragments/user/userInfo';
import channelInfoFragment from '../../fragments/channel/channelInfo';
import channelMetaDataFragment from '../../fragments/channel/channelMetaData';

export default gql`
  fragment communityChannelEconntion on Community {
    channelConnection {
      edges {
        node {
          ...channelInfo
          ...channelMetaData
          pendingUsers {
            ...userInfo
          }
        }
      }
    }
  }
  ${userInfoFragment}
`;
