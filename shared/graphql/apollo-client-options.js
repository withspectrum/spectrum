// @flow
import { toIdValue } from 'react-apollo';

const getSharedApolloClientOptions = client => ({
  queryDeduplication: true,
  dataIdFromObject: result => {
    if (result.__typename) {
      // Custom Community cache key based on slug
      if (result.__typename === 'Community' && !!result.slug) {
        return `${result.__typename}:${result.slug}`;
      }
      // Custom Channel cache key based on slug and community slug
      if (
        result.__typename === 'Channel' &&
        !!result.slug &&
        !!result.community &&
        !!result.community.slug
      ) {
        return `${result.__typename}:${result.community.slug}:${result.slug}`;
      }
      // This was copied from the default dataIdFromObject
      if (result.id !== undefined) {
        return `${result.__typename}:${result.id}`;
      }
      if (result._id !== undefined) {
        return `${result.__typename}:${result._id}`;
      }
    }
    return null;
  },
  customResolvers: {
    Query: {
      thread: (_, { id }) =>
        toIdValue(client.dataIdFromObject({ __typename: 'Thread', id })),
      community: (_, { slug }) =>
        toIdValue(client.dataIdFromObject({ __typename: 'Community', slug })),
      channel: (_, { channelSlug, communitySlug }) =>
        toIdValue(
          client.dataIdFromObject({
            __typename: 'Channel',
            slug: channelSlug,
            community: { slug: communitySlug },
          })
        ),
    },
  },
});

export default getSharedApolloClientOptions;
