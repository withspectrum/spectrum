//@flow
import React from 'react';
import { UserListItem } from '../../../components/listItems';
import { TextButton } from '../../../components/buttons';
import {
  StyledCard,
  LargeListHeading,
  ListContainer,
  Description,
} from '../../../components/listItems/style';

const PendingUsers = ({ users, togglePending }) => {
  return (
    <StyledCard>
      <LargeListHeading>
        Pending Users
      </LargeListHeading>
      {users.length > 0 &&
        <Description>
          Approving requests will allow a person to view all threads and messages in this channel, as well as allow them to post their own threads.
        </Description>}

      <ListContainer>
        {users &&
          users.map(user => {
            return (
              <section key={user.id}>
                <UserListItem user={user}>
                  <div style={{ display: 'flex' }}>
                    <TextButton
                      onClick={() => togglePending(user.id, 'block')}
                      label
                      hoverColor={'warn.alt'}
                      icon="minus"
                    >
                      Block
                    </TextButton>

                    <TextButton
                      onClick={() => togglePending(user.id, 'approve')}
                      label
                      hoverColor={'brand.default'}
                      icon="plus"
                    >
                      Approve
                    </TextButton>
                  </div>
                </UserListItem>
              </section>
            );
          })}

        {users.length <= 0 &&
          <Description>
            There are no pending requests to join this channel.
          </Description>}

      </ListContainer>
    </StyledCard>
  );
};

export default PendingUsers;
