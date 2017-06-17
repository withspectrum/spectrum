// @flow
import React from 'react';
import { Avatar } from '../../../components/avatar';
import {
  AvatarContainer,
  TwoAvatarContainer,
  TwoAvatarWrap,
  ThreeAvatarContainer,
  Remainder,
} from './style';

export const renderAvatars = users => {
  if (users.length === 1) {
    return (
      <AvatarContainer>
        <Avatar
          isOnline={users[0].isOnline}
          onlineSize={'large'}
          size={44}
          radius={44}
          src={users[0].profilePhoto}
        />
      </AvatarContainer>
    );
  }

  if (users.length === 2) {
    return (
      <TwoAvatarContainer>
        {users.map(user => {
          return (
            <TwoAvatarWrap key={user.id}>
              <Avatar
                isOnline={users.isOnline}
                size={34}
                radius={34}
                src={user.profilePhoto}
              />
            </TwoAvatarWrap>
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
            <Avatar
              isOnline={users.isOnline}
              onlineSize={'small'}
              key={user.id}
              size={20}
              radius={20}
              src={user.profilePhoto}
            />
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
            <Avatar
              isOnline={users.isOnline}
              onlineSize={'small'}
              key={user.id}
              size={19}
              radius={19}
              src={user.profilePhoto}
            />
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
                isOnline={users.isOnline}
                onlineSize={'small'}
                key={user.id}
                size={19}
                radius={19}
                src={user.profilePhoto}
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
