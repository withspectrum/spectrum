//@flow
import * as React from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
import { UserListItem } from '../../../components/listItems';
import { TextButton } from '../../../components/buttons';
import { Loading } from '../../../components/loading';
import { getBlockedUsersQuery } from '../../../api/channel';
import { SectionCard } from '../../../components/settingsViews/style';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import {
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
  isLoading: boolean,
};

class BlockedUsers extends React.Component<Props> {
  render() {
    const { data, unblock, isLoading } = this.props;

    if (data && data.channel) {
      const { blockedUsers } = data.channel;
      return (
        <SectionCard>
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
              Unblocking a user will <b>not</b> add them to this channel. It
              will only allow them to re-request access in the future as long as
              this channel remains private.
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
        </SectionCard>
      );
    }

    if (isLoading) {
      return (
        <SectionCard>
          <Loading />
        </SectionCard>
      );
    }

    return null;
  }
}

export default compose(getBlockedUsersQuery, viewNetworkHandler)(BlockedUsers);
