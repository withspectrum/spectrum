// @flow
import React from 'react';
import Icon from 'src/components/icon';
import { Pill, PillAvatar } from '../style';
import type { UserInfoType } from 'shared/graphql/fragments/user/userInfo';

type Props = {
  user: UserInfoType,
  usersForMessage: Array<UserInfoType>,
  setUsersForMessage: Function,
};

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
