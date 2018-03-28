// @flow
import type { DBChannel } from 'shared/types';

export default ({ archivedAt }: DBChannel) => {
  if (archivedAt) return true;
  return false;
};
