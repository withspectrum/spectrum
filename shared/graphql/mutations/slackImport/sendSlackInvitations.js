// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type SendSlackInvitationsType = {
  id: string,
  slug: string,
  slackImport: {
    members: string,
    teamName: string,
    sent: Date,
  },
};

export const sendSlackInvitationsMutation = gql`
  mutation sendSlackInvites($input: SendSlackInvitesInput!) {
    sendSlackInvites(input: $input) {
      id
      slug
      slackImport {
        members
        teamName
        sent
      }
    }
  }
`;

const sendSlackInvitationsOptions = {
  props: ({ mutate }) => ({
    sendSlackInvites: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  sendSlackInvitationsMutation,
  sendSlackInvitationsOptions
);
