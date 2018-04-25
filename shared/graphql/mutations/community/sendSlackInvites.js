// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import communityInfoFragment from '../../fragments/community/communityInfo';
import type { CommunityInfoType } from '../../fragments/community/communityInfo';

export type EnableBrandedLoginType = {
  data: {
    ...$Exact<CommunityInfoType>,
    slackSettings: {
      teamName: string,
      isConnected: boolean,
      hasSentInvites: boolean,
    },
  },
};

export const sendSlackInvitesMutation = gql`
  mutation sendSlackInvites($input: SendSlackInvitesInput!) {
    sendSlackInvites(input: $input) {
      ...communityInfo
      slackSettings {
        teamName
        isConnected
        hasSentInvites
      }
    }
  }
  ${communityInfoFragment}
`;

const sendSlackInvitesOptions = {
  props: ({ mutate }) => ({
    sendSlackInvites: (input: { id: string }) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(sendSlackInvitesMutation, sendSlackInvitesOptions);
