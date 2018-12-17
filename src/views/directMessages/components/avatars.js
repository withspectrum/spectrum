// @flow
import React from 'react';
import { UserAvatar } from 'src/components/avatar';
import type { ParticipantType } from 'shared/graphql/fragments/directMessageThread/directMessageThreadInfo';
import {
  AvatarContainer,
  TwoAvatarContainer,
  TwoAvatarWrap,
  ThreeAvatarContainer,
  Remainder,
} from './style';

export const renderAvatars = (users: Array<ParticipantType>) => {
  if (users.length === 1) {
    return (
      <AvatarContainer>
        <UserAvatar
          user={users[0]}
          size={44}
          isClickable={false}
          showHoverProfile={false}
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
              <UserAvatar
                user={user}
                size={34}
                isClickable={false}
                showHoverProfile={false}
                showOnlineStatus={false}
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
            <UserAvatar
              user={user}
              key={user.id}
              size={20}
              isClickable={false}
              showHoverProfile={false}
              showOnlineStatus={false}
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
            <UserAvatar
              user={user}
              key={user.id}
              size={19}
              isClickable={false}
              showHoverProfile={false}
              showOnlineStatus={false}
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
              <UserAvatar
                user={user}
                key={user.id}
                size={19}
                isClickable={false}
                showHoverProfile={false}
                showOnlineStatus={false}
              />
            );
          }

          return null;
        })}

        <Remainder>
          <span>+{remainder}</span>
        </Remainder>
      </ThreeAvatarContainer>
    );
  }

  return null;
};
