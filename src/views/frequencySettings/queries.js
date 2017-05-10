import { graphql, gql } from 'react-apollo';
import {
  communityInfoFragment,
} from '../../api/fragments/community/communityInfo';
import {
  frequencyInfoFragment,
} from '../../api/fragments/frequency/frequencyInfo';
import {
  frequencyMetaDataFragment,
} from '../../api/fragments/frequency/frequencyMetaData';

export const getThisFrequency = graphql(
  gql`
    query thisFrequency($slug: String, $community: String) {
			frequency(slug: $slug, community: $community) {
        ...frequencyInfo
        ...frequencyMetaData
        community {
          ...communityInfo
        }
      }
		}
    ${frequencyInfoFragment}
    ${communityInfoFragment}
    ${frequencyMetaDataFragment}
	`
);
