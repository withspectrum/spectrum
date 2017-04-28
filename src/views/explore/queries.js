import { graphql, gql } from 'react-apollo';

export const getFrequency = graphql(
  gql`
  query frequency($id: ID!) {
    frequency(id: $id) {
    name,
    description,
    community {
      id
    },
    slug
  }
`,
  {
    options: props => ({
      variables: { id: props.match.params.frequencyId },
    }),
    props: props => {
      return {
        data: props.data,
      };
    },
  }
);
