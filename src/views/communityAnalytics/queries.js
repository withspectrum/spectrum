// @flow
// $flowignore
import { graphql, gql } from 'react-apollo';

export const getThisCommunity = graphql(
  gql`
    query community($slug: String) {
      community(slug: $slug) {
        id
        name
        profilePhoto
      }
    }
  `,
  {
    options: props => ({
      variables: {
        slug: props.match.params.communitySlug.toLowerCase(),
      },
      fetchPolicy: 'network-only',
    }),
  }
);
