// @flow
import type { DBCommunity } from 'shared/types';
import { signImageUrl } from 'shared/imgix';

export default ({ coverPhoto }: DBCommunity) => {
  return signImageUrl(coverPhoto, { w: 1280, h: 384 });
};
