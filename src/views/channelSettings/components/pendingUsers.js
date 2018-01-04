//@flow
import * as React from 'react';
import compose from 'recompose/compose';
import { UserListItem } from '../../../components/listItems';
import { TextButton } from '../../../components/buttons';
import { Loading } from '../../../components/loading';
import viewNetworkHandler from '../../../components/viewNetworkHandler';
import { getPendingUsersQuery } from '../../../api/channel';
import {
  StyledCard,
  LargeListHeading,
  ListContainer,
  Description,
} from '../../../components/listItems/style';
import { SectionCard } from '../../../components/settingsViews/style';

type Props = {
  data: {
    channel: {
      pendingUsers: Array<Object>,
    },
  },
  togglePending: Function,
  isLoading: boolean,
};

class PendingUsers extends React.Component<Props> {
  render() {
    const { data, isLoading, togglePending } = this.props;

    if (data && data.channel) {
      const { pendingUsers } = data.channel;

      return (
        <SectionCard>
          <LargeListHeading>Pending Users</LargeListHeading>
          {pendingUsers.length > 0 && (
            <Description>
              Approving requests will allow a person to view all threads and
              messages in this channel, as well as allow them to post their own
              threads.
            </Description>
          )}

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

            {pendingUsers.length <= 0 && (
              <Description>
                There are no pending requests to join this channel.
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

export default compose(getPendingUsersQuery, viewNetworkHandler)(PendingUsers);
