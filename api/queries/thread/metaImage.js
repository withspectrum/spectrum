// @flow
import type { GraphQLContext } from '../../';
import type { DBThread } from 'shared/types';
import generateImageFromText from '../../utils/generate-thread-meta-image-from-text';
import { signImageUrl } from 'shared/imgix';

export default async (thread: DBThread, _: any, ctx: GraphQLContext) => {
  const { loaders, getImageSignatureExpiration } = ctx;
  const { isWatercooler, communityId, content } = thread;

  const community = await loaders.community.load(communityId);
  if (!community) return null;

  const imageUrl = generateImageFromText({
    title: isWatercooler
      ? `Chat with the ${community.name} community`
      : content.title,
    footer: `spectrum.chat/${community.slug}`,
  });

  if (!imageUrl) return null;

  return signImageUrl(imageUrl, {
    expires: getImageSignatureExpiration(),
  });
};
