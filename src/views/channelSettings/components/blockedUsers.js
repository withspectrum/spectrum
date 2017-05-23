//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
import { addToastWithTimeout } from '../../../actions/toasts';
import { ListCardItemUser } from '../../../components/listCard';
import { TextButton } from '../../../components/buttons';
import { unblockUserInChannelMutation } from '../../../api/channel';
import {
  StyledCard,
  LargeListHeading,
  ListContainer,
  Description,
  Notice,
} from '../../../components/listCard/style';

class BlockedUsersWithMutation extends Component {
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

  unblock = userId => {
    const { channel: { id } } = this.props;

    const input = {
      channelId: id,
      userId,
    };

    this.props
      .unblockUser(input)
      .then(({ data: { unblockUser } }) => {
        const channel = unblockUser;

        // the mutation returns a channel object. if it exists,
        if (channel !== undefined) {
          this.props.dispatch(
            addToastWithTimeout('success', 'User was un-blocked.')
          );
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
                      onClick={() => this.unblock(user.id)}
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
  }
}

const BlockedUsers = compose(unblockUserInChannelMutation)(
  BlockedUsersWithMutation
);
export default connect()(BlockedUsers);
