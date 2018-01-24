// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import userInfoFragment from '../../fragments/user/userInfo';

export const getComposerCommunitiesAndChannelsQuery = gql`
  query getComposerCommunitiesAndChannels {
    user: currentUser {
      ...userInfo
      communityConnection {
        edges {
          node {
            id
            name
            slug
            profilePhoto
            communityPermissions {
              isMember
              isBlocked
              isOwner
              isModerator
              reputation
            }
          }
        }
      }
      channelConnection {
        edges {
          node {
            id
            name
            slug
            isDefault
            isPrivate
            community {
              id
              isPro
            }
            channelPermissions {
              isMember
              isPending
              isBlocked
              isOwner
              isModerator
            }
          }
        }
      }
    }
  }
  ${userInfoFragment}
`;

const getComposerCommunitiesAndChannelsOptions = {
  options: { fetchPolicy: 'cache-first' },
};

export default graphql(
  getComposerCommunitiesAndChannelsQuery,
  getComposerCommunitiesAndChannelsOptions
);
