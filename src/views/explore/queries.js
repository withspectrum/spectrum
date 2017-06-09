//@flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import {
  communityInfoFragment,
} from '../../api/fragments/community/communityInfo';

export const getCommunity = graphql(
  gql`
		query getCommunity($slug: String) {
			community(slug: $slug) {
        ...communityInfo
      }
		}
    ${communityInfoFragment}
	`,
  {
    props: ({ data: { error, loading, community } }) => ({
      data: {
        error,
        loading,
        community,
      },
    }),
  }
);

// export const getTopChannels = graphql(
//   gql`
// 		{
// 		  topChannels {
//         ...channelInfo
//         community {
//           ...communityInfo
//         }
//         metaData {
//           members
//         }
//       }
//     }
//     ${channelInfoFragment}
//     ${communityInfoFragment}
// 	`,
//   {
//     props: ({ data: { error, loading, topChannels } }) => ({
//       data: {
//         error,
//         loading,
//         topChannels,
//       },
//     }),
//   }
// );
