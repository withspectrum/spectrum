// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export type SendCommunityEmailInvitesType = {
  data: {
    sendEmailInvites: boolean,
  },
};

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

export const sendCommunityEmailInvitesMutation = gql`
  mutation sendEmailInvites($input: EmailInvitesInput!) {
    sendEmailInvites(input: $input)
  }
`;

const sendCommunityEmailInvitesOptions = {
  props: ({ mutate }) => ({
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
