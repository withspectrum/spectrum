// @flow
import type { DBCommunity } from 'shared/types';
import { signImageUrl } from 'shared/imgix';

// prettier-ignore
export const signCommunity = (community: DBCommunity, expires?: number): DBCommunity => {
  const { profilePhoto, coverPhoto, ...rest } = community;

  return {
    ...rest,
    profilePhoto: signImageUrl(profilePhoto, { 
      w: 256, 
      h: 256, 
      dpr: 2, 
      auto: 'compress',
      expires 
    }),
    coverPhoto: signImageUrl(coverPhoto, { 
      w: 1280, 
      h: 384, 
      dpr: 2, 
      q: 100,
      expires 
    }),
  };
};
