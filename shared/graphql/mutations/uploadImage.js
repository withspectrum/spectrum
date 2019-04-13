// @flow
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import type { EntityTypes } from 'shared/types';

export type UploadImageType = {
  data: {
    uploadImage: string,
  },
};

export type UploadImageInput = {
  image: Object,
  type: EntityTypes,
  id?: string,
};

export const uploadImageMutation = gql`
  mutation uploadImage($input: UploadImageInput!) {
    uploadImage(input: $input)
  }
`;

const uploadImageOptions = {
  props: ({ mutate }) => ({
    uploadImage: (input: UploadImageInput) =>
      mutate({
        variables: {
          input,
        },
      }),
  }),
};

export default graphql(uploadImageMutation, uploadImageOptions);
