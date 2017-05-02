import React from 'react';
import { Wrapper, Avatar, UserMeta, Name, Meta } from './style';

const UserHeader = ({ avatarSize = 'large', ...props }) => {
  return (
    <Wrapper>
      <Avatar size={avatarSize} src="./img/avatar.jpg" title="Bryn Jackson" />
      <UserMeta>
        <Name>Bryn Jackson</Name>
        <Meta>Just now •&nbsp;No messages yet</Meta>
      </UserMeta>
    </Wrapper>
  );
};

export default UserHeader;
