// @flow
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import threadInfoFragment from 'shared/graphql/fragments/thread/threadInfo';

const getThreadByIdQuery = gql`
  query getThread($id: ID!) {
    thread(id: $id) {
      ...threadInfo
    }
  }
  ${threadInfoFragment}
`;

const getThreadByIdOptions = {
  options: ({ id }) => ({
    variables: {
      id,
    },
  }),
};

export default graphql(getThreadByIdQuery, getThreadByIdOptions);
