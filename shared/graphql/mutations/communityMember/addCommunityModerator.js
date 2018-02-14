// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityMemberInfoFragment, {
  type CommunityMemberInfoType,
} from '../../fragments/communityMember/communityMemberInfo';

export type AddCommunityModeratorType = {
  data: {
    addCommunityModerator: CommunityMemberInfoType,
  },
};

export const addCommunityModeratorQuery = gql`
  mutation addCommunityModerator($input: AddCommunityModeratorInput!) {
    addCommunityModerator(input: $input) {
      ...communityMemberInfo
    }
  }
  ${communityMemberInfoFragment}
`;

const addCommunityModeratorOptions = {
  props: ({ mutate }) => ({
    addCommunityModerator: ({ input }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  addCommunityModeratorQuery,
  addCommunityModeratorOptions
);
