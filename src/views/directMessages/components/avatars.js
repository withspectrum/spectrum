// @flow
import React from 'react';
import { Avatar } from '../../../components/avatar';
import {
  AvatarContainer,
  TwoAvatarContainer,
  ThreeAvatarContainer,
  Remainder,
} from './style';

export const renderAvatars = users => {
  if (users.length === 1) {
    return (
      <AvatarContainer>
        <Avatar size={44} radius={44} src={users[0].photoURL} />
      </AvatarContainer>
    );
  }

  if (users.length === 2) {
    return (
      <TwoAvatarContainer>
        {users.map(user => {
          return (
            <Avatar key={user.uid} size={34} radius={34} src={user.photoURL} />
          );
        })}
      </TwoAvatarContainer>
    );
  }

  if (users.length === 3) {
    return (
      <ThreeAvatarContainer>
        {users.map(user => {
          return (
            <Avatar key={user.uid} size={20} radius={20} src={user.photoURL} />
          );
        })}
      </ThreeAvatarContainer>
    );
  }

  if (users.length === 4) {
    return (
      <ThreeAvatarContainer>
        {users.map(user => {
          return (
            <Avatar key={user.uid} size={19} radius={19} src={user.photoURL} />
          );
        })}
      </ThreeAvatarContainer>
    );
  }

  if (users.length > 4) {
    const remainder = users.length % 4;

    return (
      <ThreeAvatarContainer>
        {users.map((user, i) => {
          while (i < 3) {
            return (
              <Avatar
                key={user.uid}
                size={19}
                radius={19}
                src={user.photoURL}
              />
            );
          }

          return null;
        })}

        <Remainder><span>+{remainder}</span></Remainder>
      </ThreeAvatarContainer>
    );
  }

  return null;
};
