// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityMemberInfoFragment, {
  type CommunityMemberInfoType,
} from '../../fragments/communityMember/communityMemberInfo';

export type RemoveCommunityModeratorType = {
  data: {
    removeCommunityModerator: CommunityMemberInfoType,
  },
};

export const removeCommunityModeratorQuery = gql`
  mutation removeCommunityModerator($input: RemoveCommunityModeratorInput!) {
    removeCommunityModerator(input: $input) {
      ...communityMemberInfo
    }
  }
  ${communityMemberInfoFragment}
`;

const removeCommunityModeratorOptions = {
  props: ({ mutate }) => ({
    removeCommunityModerator: ({ input }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  removeCommunityModeratorQuery,
  removeCommunityModeratorOptions
);
