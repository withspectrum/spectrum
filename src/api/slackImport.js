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
        }
      }
		}
	`,
  getSlackImportOptions
);
