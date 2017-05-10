//@flow
import React from 'react';

import { Avatar } from '../../../components/avatar';

const UserAvatar = props => {
  const { user } = props;
  return <Avatar src={user.photoURL} size={32} radius={16} />;
};

export default UserAvatar;
