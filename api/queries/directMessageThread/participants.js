// @flow
import type { GraphQLContext } from '../../';
import { canViewDMThread } from '../../utils/permissions';
import { signImageUrl } from 'shared/imgix';

export default async ({ id }: { id: string }, _: any, ctx: GraphQLContext) => {
  const { loaders, user, getImageSignatureExpiration } = ctx;
  if (!user || !user.id) return null;

  const canViewThread = await canViewDMThread(user.id, id, loaders);

  if (!canViewThread) return null;

  return loaders.directMessageParticipants.load(id).then(results => {
    if (!results || results.length === 0) return null;
    return results.reduction.map(user => {
      return {
        ...user,
        coverPhoto: signImageUrl(user.coverPhoto, {
          w: 1280,
          h: 384,
          expires: getImageSignatureExpiration(),
        }),
        profilePhoto: signImageUrl(user.profilePhoto, {
          w: 256,
          h: 256,
          expires: getImageSignatureExpiration(),
        }),
      };
    });
  });
};
