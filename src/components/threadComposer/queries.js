// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { userInfoFragment } from '../../api/fragments/user/userInfo';

export const GET_COMPOSER_COMMUNITIES_AND_CHANNELS_QUERY = gql`
query getComposerCommunitiesAndChannels {
  # Not using the communityConnection or channelConnection fragments here
  # because for this particular scenario I'm only trying to return much
  # deeper nested data in order to handle channel + community selection in
  # the composer
  #
  # TODO: Eventually we should run one query at app initialization for all of
  # a user's communities + channels, save that in the thread somewhere, and
  # use it to hydrate the composer here, as well as use the data to handle
  # join/leave, follow/unfollow buttons, etc. as the user browsers around
  # to different threads, channels, and users.
  user: currentUser {
    ...userInfo
    communityConnection {
      edges {
        node {
          id
          name
          slug
          communityPermissions {
            isMember
            isBlocked
            isOwner
            isModerator
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
          community {
            id
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

export const getComposerCommunitiesAndChannels = graphql(
  GET_COMPOSER_COMMUNITIES_AND_CHANNELS_QUERY
);
