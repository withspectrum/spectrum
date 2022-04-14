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
      dpr: 2,
      auto: 'compress',
      expires,
    }),
    coverPhoto: signImageUrl(coverPhoto, {
      w: 1280,
      h: 384,
      dpr: 2,
      q: 100,
      expires,
    }),
  };
};
