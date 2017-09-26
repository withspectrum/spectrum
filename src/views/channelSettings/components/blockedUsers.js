//@flow
import * as React from 'react';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import compose from 'recompose/compose';
import { UserListItem } from '../../../components/listItems';
import { TextButton } from '../../../components/buttons';
import { displayLoadingCard } from '../../../components/loading';
import { getBlockedUsersQuery } from '../../../api/channel';
import {
  StyledCard,
  LargeListHeading,
  ListContainer,
  Description,
  Notice,
} from '../../../components/listItems/style';

type Props = {
  data: {
    channel: {
      blockedUsers: Array<Object>,
    },
  },
  unblock: Function,
};

class BlockedUsers extends React.Component<Props> {
  render() {
    const { data: { channel: { blockedUsers } }, unblock } = this.props;

    return (
      <StyledCard>
        <LargeListHeading>Blocked Users</LargeListHeading>
        {blockedUsers.length > 0 && (
          <Description>
            Blocked users can not see threads or messages posted in this
            channel. They will still be able to join any other public channels
            in the Spectrum community and request access to other private
            channels.
          </Description>
        )}

        {blockedUsers.length > 0 && (
          <Notice>
            Unblocking a user will <b>not</b> add them to this channel. It will
            only allow them to re-request access in the future as long as this
            channel remains private.
          </Notice>
        )}

        <ListContainer>
          {blockedUsers &&
            blockedUsers.map(user => {
              return (
                <section key={user.id}>
                  <UserListItem user={user}>
                    <TextButton
                      onClick={() => unblock(user.id)}
                      label
                      hoverColor={'warn.alt'}
                    >
                      Unblock
                    </TextButton>
                  </UserListItem>
                </section>
              );
            })}

          {blockedUsers.length <= 0 && (
            <Description>
              There are no blocked users in this channel.
            </Description>
          )}
        </ListContainer>
      </StyledCard>
    );
  }
}

export default compose(getBlockedUsersQuery, displayLoadingCard, pure)(
  BlockedUsers
);
