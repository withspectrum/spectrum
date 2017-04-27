import { graphql, gql } from 'react-apollo';

export const getCommunity = graphql(
  gql`
		query getCommunity($slug: String) {
			community(slug: $slug) {
        id
        name
        slug
      }
		}
	`,
  {
    options: props => ({
      variables: {
        slug: props.match.params.communitySlug,
      },
    }),
  }
);
