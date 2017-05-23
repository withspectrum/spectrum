//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
import { addToastWithTimeout } from '../../../actions/toasts';
import { ListCardItemUser } from '../../../components/listCard';
import { TextButton } from '../../../components/buttons';
import { togglePendingUserInChannelMutation } from '../../../api/channel';
import {
  StyledCard,
  LargeListHeading,
  ListContainer,
  Description,
} from '../../../components/listCard/style';

class PendingUsersWithMutation extends Component {
  constructor(props) {
    super(props);

    const { users } = this.props;

    this.state = {
      users,
    };
  }

  updateUsersList = id => {
    this.setState(prevState => {
      return {
        ...prevState,
        users: prevState.users.filter(user => user.id !== id),
      };
    });
  };

  togglePending = (userId, action) => {
    const { channel: { id } } = this.props;

    const input = {
      channelId: id,
      userId,
      action,
    };

    this.props
      .togglePendingUser(input)
      .then(({ data: { togglePendingUser } }) => {
        const channel = togglePendingUser;

        // the mutation returns a channel object. if it exists,
        if (channel !== undefined) {
          this.props.dispatch(addToastWithTimeout('success', 'Saved!'));
          this.updateUsersList(userId);
        }
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', err));
      });
  };

  render() {
    const { users } = this.state;

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
                  <ListCardItemUser user={user}>
                    <div style={{ display: 'flex' }}>
                      <TextButton
                        onClick={() => this.togglePending(user.id, 'block')}
                        label
                        hoverColor={'warn.alt'}
                        icon="minus"
                      >
                        Block
                      </TextButton>

                      <TextButton
                        onClick={() => this.togglePending(user.id, 'approve')}
                        label
                        hoverColor={'brand.default'}
                        icon="plus"
                      >
                        Approve
                      </TextButton>
                    </div>
                  </ListCardItemUser>
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
  }
}

const PendingUsers = compose(togglePendingUserInChannelMutation)(
  PendingUsersWithMutation
);
export default connect()(PendingUsers);
