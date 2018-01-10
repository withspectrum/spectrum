// @flow
import type { DBCommunity } from 'shared/types';
import { getThreads } from '../../models/thread';

export default async ({ watercoolerId }: DBCommunity) => {
  if (!watercoolerId) return null;
  return await getThreads([watercoolerId]).then(
    res => (res && res.length > 0 ? res[0] : null)
  );
};
