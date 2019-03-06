// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';

export const disableCommunityWatercoolerMutation = gql`
  mutation disableCommunityWatercooler(
    $input: DisableCommunityWatercoolerInput!
  ) {
    disableCommunityWatercooler(input: $input) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const disableCommunityWatercoolerOptions = {
  props: ({ mutate }) => ({
    disableCommunityWatercooler: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  disableCommunityWatercoolerMutation,
  disableCommunityWatercoolerOptions
);
