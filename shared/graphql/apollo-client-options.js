var apollo = require('react-apollo'),
  toIdValue = apollo.toIdValue;

function dataIdFromObject(result) {
  if (result.__typename) {
    // Custom Community cache key based on slug
    if (result.__typename === 'Community' && !!result.slug) {
      return result.__typename + ':' + result.slug;
    }
    // Custom Channel cache key based on slug and community slug
    if (
      result.__typename === 'Channel' &&
      !!result.slug &&
      !!result.community &&
      !!result.community.slug
    ) {
      return (
        result.__typename + ':' + result.community.slug + ':' + result.slug
      );
    }
    // This was copied from the default dataIdFromObject
    if (result.id !== undefined) {
      return result.__typename + ':' + result.id;
    }
    if (result._id !== undefined) {
      return result.__typename + ':' + result._id;
    }
  }
  return null;
}

var getSharedApolloClientOptions = function getSharedApolloClientOptions() {
  return {
    queryDeduplication: true,
    dataIdFromObject: dataIdFromObject,
    customResolvers: {
      Query: {
        thread: function thread(_, _ref) {
          var id = _ref.id;
          return toIdValue(dataIdFromObject({ __typename: 'Thread', id: id }));
        },
        community: function community(_, _ref2) {
          var slug = _ref2.slug;
          return toIdValue(
            dataIdFromObject({ __typename: 'Community', slug: slug })
          );
        },
        channel: function channel(_, _ref3) {
          var channelSlug = _ref3.channelSlug,
            communitySlug = _ref3.communitySlug;
          return toIdValue(
            dataIdFromObject({
              __typename: 'Channel',
              slug: channelSlug,
              community: { slug: communitySlug },
            })
          );
        },
      },
    },
  };
};

module.exports = getSharedApolloClientOptions;
