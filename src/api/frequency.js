// @flow
// $FlowFixMe
import { graphql, gql } from 'react-apollo';
import { frequencyInfoFragment } from './fragments/frequency/frequencyInfo';

/*
  Create a new frequency
*/
const CREATE_FREQUENCY_MUTATION = gql`
  mutation createFrequency($input: CreateFrequencyInput!) {
    createFrequency (input: $input) {
      ...frequencyInfo
    }
  }
  ${frequencyInfoFragment}
`;

const CREATE_FREQUENCY_OPTIONS = {
  props: ({ input, mutate }) => ({
    createFrequency: input =>
      mutate({
        variables: {
          input,
        },
      })
        .then(({ data }) => {
          return data.createFrequency;
        })
        .catch(error => {
          // TODO: Add dispatch for global errors
          console.log('error creating frequency', error);
        }),
  }),
};

export const createFrequencyMutation = graphql(
  CREATE_FREQUENCY_MUTATION,
  CREATE_FREQUENCY_OPTIONS
);

/*
  Delete a frequency
*/
const DELETE_FREQUENCY_MUTATION = gql`
  mutation deleteFrequency($id: ID!) {
    deleteFrequency (id: $id)
  }
`;

const DELETE_FREQUENCY_OPTIONS = {
  props: ({ id, mutate }) => ({
    deleteFrequency: id =>
      mutate({
        variables: {
          id,
        },
      })
        .then(({ data }) => {
          console.log('mutation complete ', data);
        })
        .catch(error => {
          console.log('error deleting frequency', error);
        }),
  }),
};

export const deleteFrequencyMutation = graphql(
  DELETE_FREQUENCY_MUTATION,
  DELETE_FREQUENCY_OPTIONS
);
