// @flow
import type { DBUser } from 'shared/types';
import { signImageUrl } from 'shared/imgix';

export const signUser = (user: DBUser, expires?: number): DBUser => {
  const { profilePhoto, coverPhoto, ...rest } = user;

  return {
    ...rest,
    profilePhoto: signImageUrl(profilePhoto, {
      w: 256,
      h: 256,
      expires,
    }),
    coverPhoto: signImageUrl(coverPhoto, {
      w: 1280,
      h: 384,
      expires,
    }),
  };
};
