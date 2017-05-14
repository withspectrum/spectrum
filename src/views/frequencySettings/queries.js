import { graphql, gql } from 'react-apollo';
import {
  communityInfoFragment,
} from '../../api/fragments/community/communityInfo';
import {
  frequencyInfoFragment,
} from '../../api/fragments/frequency/frequencyInfo';
import { userInfoFragment } from '../../api/fragments/user/userInfo';
import {
  frequencyMetaDataFragment,
} from '../../api/fragments/frequency/frequencyMetaData';

export const getThisFrequency = graphql(
  gql`
    query thisFrequency($slug: String, $community: String) {
			frequency(slug: $slug, community: $community) {
        ...frequencyInfo
        pendingUsers {
          ...userInfo
        }
        blockedUsers {
          ...userInfo
        }
        ...frequencyMetaData
        community {
          ...communityInfo
        }
      }
		}
    ${frequencyInfoFragment}
    ${userInfoFragment}
    ${communityInfoFragment}
    ${frequencyMetaDataFragment}
	`,
  {
    options: ({ match }) => ({
      variables: {
        slug: match.params.frequencySlug,
        community: match.params.communitySlug,
      },
    }),
  }
);
