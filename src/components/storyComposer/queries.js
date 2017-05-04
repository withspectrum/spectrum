// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import {
  communityInfoFragment,
} from '../../api/fragments/community/communityInfo';
import {
  frequencyInfoFragment,
} from '../../api/fragments/frequency/frequencyInfo';

export const getComposerCommunitiesAndFrequencies = graphql(
  gql`
  query getComposerCommunitiesAndFrequencies {
    # Not using the communityConnection or frequencyConnection fragments here
    # because for this particular scenario I'm only trying to return much
    # deeper nested data in order to handle frequency + community selection in
    # the composer
    #
    # TODO: Eventually we should run one query at app initialization for all of
    # a user's communities + frequencies, save that in the story somewhere, and
    # use it to hydrate the composer here, as well as use the data to handle
    # join/leave, follow/unfollow buttons, etc. as the user browsers around
    # to different stories, frequencies, and users.
    user: currentUser {
      communityConnection {
        edges {
          node {
            ...communityInfo
            frequencyConnection {
              edges {
                node {
                  ...frequencyInfo
                  community {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ${communityInfoFragment}
  ${frequencyInfoFragment}
`
);
