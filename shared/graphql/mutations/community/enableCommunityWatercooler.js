// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from 'shared/graphql/fragments/community/communityInfo';

export const enableCommunityWatercoolerMutation = gql`
  mutation enableCommunityWatercooler(
    $input: EnableCommunityWatercoolerInput!
  ) {
    enableCommunityWatercooler(input: $input) {
      ...communityInfo
    }
  }
  ${communityInfoFragment}
`;

const enableCommunityWatercoolerOptions = {
  props: ({ mutate }) => ({
    enableCommunityWatercooler: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  enableCommunityWatercoolerMutation,
  enableCommunityWatercoolerOptions
);
