//@flow
import React from 'react';
import { UserListItem } from '../../../components/listItems';
import { TextButton } from '../../../components/buttons';
import pure from 'recompose/pure';
import compose from 'recompose/compose';
import { displayLoadingCard } from '../../../components/loading';
import { getPendingUsersQuery } from '../../../api/channel';
import {
  StyledCard,
  LargeListHeading,
  ListContainer,
  Description,
} from '../../../components/listItems/style';

const PendingUsers = ({
  data: { channel: { pendingUsers }, togglePending },
}) => {
  return (
    <StyledCard>
      <LargeListHeading>
        Pending Users
      </LargeListHeading>
      {pendingUsers.length > 0 &&
        <Description>
          Approving requests will allow a person to view all threads and messages in this channel, as well as allow them to post their own threads.
        </Description>}

      <ListContainer>
        {pendingUsers &&
          pendingUsers.map(user => {
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

        {pendingUsers.length <= 0 &&
          <Description>
            There are no pending requests to join this channel.
          </Description>}

      </ListContainer>
    </StyledCard>
  );
};

export default compose(getPendingUsersQuery, displayLoadingCard, pure)(
  PendingUsers
);
