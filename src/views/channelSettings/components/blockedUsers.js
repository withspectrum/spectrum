//@flow
import React from 'react';
import { ListCardItemUser } from '../../../components/listCard';
import { TextButton } from '../../../components/buttons';
import {
  StyledCard,
  LargeListHeading,
  ListContainer,
  Description,
  Notice,
} from '../../../components/listCard/style';

const BlockedUsers = ({ users, unblock }) => {
  return (
    <StyledCard>
      <LargeListHeading>Blocked Users</LargeListHeading>
      {users.length > 0 &&
        <Description>
          Blocked users can not see threads or messages posted in this channel. They will still be able to join any other public channels in the Spectrum community and request access to other private channels.
        </Description>}

      {users.length > 0 &&
        <Notice>
          Unblocking a user will
          {' '}
          <b>not</b>
          {' '}
          add them to this channel. It will only allow them to re-request access in the future as long as this channel remains private.
        </Notice>}

      <ListContainer>
        {users &&
          users.map(user => {
            return (
              <section key={user.id}>
                <ListCardItemUser user={user}>
                  <TextButton
                    onClick={() => unblock(user.id)}
                    label
                    hoverColor={'warn.alt'}
                  >
                    Unblock
                  </TextButton>
                </ListCardItemUser>
              </section>
            );
          })}

        {users.length <= 0 &&
          <Description>
            There are no blocked users in this channel.
          </Description>}

      </ListContainer>
    </StyledCard>
  );
};

export default BlockedUsers;
