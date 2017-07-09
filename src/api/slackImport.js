// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';

const getSlackImportOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export const getSlackImport = graphql(
  gql`
    query getSlackImport($id: ID!) {
      community(id: $id) {
        id
        slackImport {
          members
          teamName
          sent
        }
      }
    }
  `,
  getSlackImportOptions
);

const SEND_SLACK_INVITATIONS_MUTATION = gql`
  mutation sendSlackInvites($input: SendSlackInvitesInput!) {
    sendSlackInvites(input: $input) {
      id
      slackImport {
        members
        teamName
        sent
      }
    }
  }
`;
const SEND_SLACK_INVITATIONS_OPTIONS = {
  props: ({ input, mutate }) => ({
    sendSlackInvites: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export const sendSlackInvitationsMutation = graphql(
  SEND_SLACK_INVITATIONS_MUTATION,
  SEND_SLACK_INVITATIONS_OPTIONS
);
