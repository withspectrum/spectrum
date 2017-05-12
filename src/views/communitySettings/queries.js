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

export const getThisCommunity = graphql(
  gql`
    query thisCommunity($slug: String) {
			community(slug: $slug) {
        ...communityInfo
      }
		}
    ${communityInfoFragment}
	`,
  {
    options: props => ({
      variables: {
        slug: props.match.params.communitySlug,
      },
    }),
  }
);

export const getFrequenciesByCommunity = graphql(
  gql`
    query frequenciesByCommunity($slug: String) {
			community(slug: $slug) {
        ...communityInfo
        frequencyConnection {
          edges {
            node {
              ...frequencyInfo
              ...frequencyMetaData
            }
          }
        }
      }
		}
    ${communityInfoFragment}
    ${frequencyInfoFragment}
    ${frequencyMetaDataFragment}
	`
);
