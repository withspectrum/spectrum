// @flow
import type { DBUser } from 'shared/types';
import { signImageUrl } from 'shared/imgix';

export default ({ profilePhoto }: DBUser) => {
  return signImageUrl(profilePhoto, { w: 256, h: 256 });
};
