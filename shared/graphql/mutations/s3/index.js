// @flow
// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

export const getSignedS3UrlMutation = gql`
  mutation getSignedS3Url($input: GetSignedS3UrlInput!) {
    getSignedS3Url(input: $input) {
      signedUrl
    }
  }
`;

const getSignedS3UrlOptions = {
  props: ({ mutate }) => ({
    getSignedS3Url: input =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export const getSignedS3Url = graphql(
  getSignedS3UrlMutation,
  getSignedS3UrlOptions
);
