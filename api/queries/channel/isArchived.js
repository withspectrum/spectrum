// @flow
import type { DBChannel } from 'shared/types';

export default ({ archivedAt, ...rest }: DBChannel) => {
  if (archivedAt) return true;
  return false;
};
