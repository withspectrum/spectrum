import { graphql, gql } from 'react-apollo';

export const getFrequency = graphql(
  gql`
		query getFrequency($slug: String, $community: String) {
			frequency(slug: $slug, community: $community) {
				id
				name
				community {
					name
          id
				}
			}
		}
	`,
  {
    options: props => ({
      variables: {
        slug: props.match.params.frequencySlug,
        community: props.match.params.communitySlug,
      },
    }),
  }
);
