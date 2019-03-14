// @flow
import { setCommunityLastSeen } from '../../models/usersCommunities';
import { isAuthedResolver } from '../../utils/permissions';
import type { DBCommunity } from 'shared/types';

type Args = {
  id: string,
  lastSeen: Date,
};

export default isAuthedResolver(
  (root: DBCommunity, { id, lastSeen }: Args, { loaders, user }) => {
    return setCommunityLastSeen(id, user.id, lastSeen);
  }
);
