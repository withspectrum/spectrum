//@flow
import React from 'react';
//$FlowFixMe
import { Link } from 'react-router-dom';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import compose from 'recompose/compose';
import { displayLoadingCard } from '../../../components/loading';
import { ListCardItemUser } from '../../../components/listCardItem';
import { FlexRow, FlexCol } from '../../../components/globals';
import { LinkButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import { toggleBlockedUserInFrequencyMutation } from '../../../api/frequency';
import {
  StyledCard,
  ListHeading,
  ListContainer,
  MoreLink,
  Description,
} from '../style';

const BlockedUsersPure = ({ users, frequency, toggleBlocked }) => {
  return (
    <StyledCard>
      <ListHeading>Blocked Users</ListHeading>

      {users.length > 0 &&
        <Description>
          Blocked users will not be able to see stories or messages posted in this channel. They will still be able to join any other public channels in the
          {' '}
          {frequency.community.name}
          {' '}
          community and request access to other private channels.
        </Description>}

      <ListContainer>
        {users &&
          users.map(user => {
            return (
              <section key={user.uid}>
                <ListCardItemUser user={user}>
                  <div style={{ display: 'flex' }}>
                    <LinkButton
                      onClick={() => toggleBlocked(user.uid, 'unblock')}
                      label
                      hoverColor={'brand.default'}
                    >
                      Unblock
                    </LinkButton>
                  </div>
                </ListCardItemUser>
              </section>
            );
          })}

        {users.length <= 0 && <div>No users have been blocked</div>}

      </ListContainer>
    </StyledCard>
  );
};

const BlockedUsers = compose(toggleBlockedUserInFrequencyMutation, pure)(
  BlockedUsersPure
);
export default connect()(BlockedUsers);
