// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

type ReportUserInput = {
  userId: string,
  reason: string,
};

export const reportUserMutation = gql`
  mutation reportUser($input: ReportUserInput!) {
    reportUser(input: $input)
  }
`;

const reportUserOptions = {
  props: ({ mutate }) => ({
    reportUser: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(reportUserMutation, reportUserOptions);
