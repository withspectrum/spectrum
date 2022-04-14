// @flow
import { setCommunityLastSeen } from '../../models/usersCommunities';
import { getCommunityById } from '../../models/community';
import { isAuthedResolver } from '../../utils/permissions';

type Args = {
  input: {
    id: string,
    lastSeen: Date,
  },
};

export default isAuthedResolver(
  (_: void, { input: { id, lastSeen } }: Args, { user }) => {
    return setCommunityLastSeen(id, user.id, lastSeen).then(() =>
      getCommunityById(id)
    );
  }
);
