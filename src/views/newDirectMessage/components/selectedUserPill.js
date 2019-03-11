// @flow
import React from 'react';
import Icon from 'src/components/icons';
import { Pill, PillAvatar } from '../style';

const SelectedUserPill = (props: Props) => {
  const { user, usersForMessage, setUsersForMessage } = props;

  const handleUserSelection = () => {
    setUsersForMessage(usersForMessage.filter(u => u.id !== user.id));
  };

  return (
    <Pill onClick={handleUserSelection}>
      <PillAvatar src={user.profilePhoto} />
      {user.name}
      <Icon glyph={'view-close'} size={20} />
    </Pill>
  );
};

export default SelectedUserPill;
