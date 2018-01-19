// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

type Contact = {
  email: string,
  firstName?: ?string,
  lastName?: ?string,
};

type EmailInvitesInput = {
  id: string,
  contacts: Array<Contact>,
  customMessage?: ?string,
};

const sendCommunityEmailInvitesMutation = gql`
  mutation sendEmailInvites($input: EmailInvitesInput!) {
    sendEmailInvites(input: $input)
  }
`;
const sendCommunityEmailInvitesOptions = {
  props: ({ input, mutate }) => ({
    sendEmailInvites: (input: EmailInvitesInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(
  sendCommunityEmailInvitesMutation,
  sendCommunityEmailInvitesOptions
);
