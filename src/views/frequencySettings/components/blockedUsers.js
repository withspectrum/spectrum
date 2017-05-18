//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
import { addToastWithTimeout } from '../../../actions/toasts';
import { ListCardItemUser } from '../../../components/listCardItem';
import { TextButton } from '../../../components/buttons';
import { unblockUserInFrequencyMutation } from '../../../api/frequency';
import {
  StyledCard,
  ListHeading,
  ListContainer,
  Description,
  Notice,
} from '../style';

class BlockedUsersWithMutation extends Component {
  constructor(props) {
    super(props);

    const { users } = this.props;

    this.state = {
      users,
    };
  }

  updateUsersList = uid => {
    this.setState(prevState => {
      return {
        ...prevState,
        users: prevState.users.filter(user => user.uid !== uid),
      };
    });
  };

  unblock = userId => {
    const { frequency: { id } } = this.props;

    const input = {
      frequencyId: id,
      userId,
    };

    this.props
      .unblockUser(input)
      .then(({ data: { unblockUser } }) => {
        const frequency = unblockUser;

        // the mutation returns a frequency object. if it exists,
        if (frequency !== undefined) {
          this.props.dispatch(
            addToastWithTimeout('success', 'User was un-blocked.')
          );
          this.updateUsersList(uid);
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
        <ListHeading>Blocked Users</ListHeading>
        {users.length > 0 &&
          <Description>
            Blocked users can not see stories or messages posted in this channel. They will still be able to join any other public channels in the Spectrum community and request access to other private channels.
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
                <section key={user.uid}>
                  <ListCardItemUser user={user}>
                    <TextButton
                      onClick={() => this.unblock(user.uid)}
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

const BlockedUsers = compose(unblockUserInFrequencyMutation)(
  BlockedUsersWithMutation
);
export default connect()(BlockedUsers);
