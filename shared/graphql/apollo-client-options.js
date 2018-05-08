// @flow
var apollo = require('apollo-utilities'),
  toIdValue = apollo.toIdValue;

function dataIdFromObject(result: any) {
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
    cacheRedirects: {
      Query: {
        thread: function thread(_: any, _ref: any) {
          var id = _ref.id;
          return toIdValue(dataIdFromObject({ __typename: 'Thread', id: id }));
        },
        community: function community(_: any, _ref2: any) {
          var slug = _ref2.slug;
          return toIdValue(
            dataIdFromObject({ __typename: 'Community', slug: slug })
          );
        },
        channel: function channel(_: any, _ref3: any) {
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
