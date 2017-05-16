//@flow
import React, { Component } from 'react';
//$FlowFixMe
import { connect } from 'react-redux';
//$FlowFixMe
import compose from 'recompose/compose';
import { addToastWithTimeout } from '../../../actions/toasts';
import { ListCardItemUser } from '../../../components/listCardItem';
import { TextButton } from '../../../components/buttons';
import { togglePendingUserInFrequencyMutation } from '../../../api/frequency';
import { StyledCard, ListHeading, ListContainer, Description } from '../style';

class PendingUsersWithMutation extends Component {
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

  togglePending = (uid, action) => {
    const { frequency: { id } } = this.props;

    const input = {
      id,
      uid,
      action,
    };

    this.props
      .togglePendingUser(input)
      .then(({ data: { togglePendingUser } }) => {
        const frequency = togglePendingUser;

        // the mutation returns a frequency object. if it exists,
        if (frequency !== undefined) {
          this.props.dispatch(addToastWithTimeout('success', 'User saved.'));
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
        <ListHeading>Pending Users</ListHeading>
        {users.length > 0 &&
          <Description>
            Approving requests will allow a person to view all stories and messages in this channel, as well as allow them to post their own stories.
          </Description>}

        <ListContainer>
          {users &&
            users.map(user => {
              return (
                <section key={user.uid}>
                  <ListCardItemUser user={user}>
                    <div style={{ display: 'flex' }}>
                      <TextButton
                        onClick={() => this.togglePending(user.uid, 'block')}
                        label
                        hoverColor={'warn.alt'}
                        icon="unsubscribe"
                      >
                        Block
                      </TextButton>

                      <TextButton
                        onClick={() => this.togglePending(user.uid, 'approve')}
                        label
                        hoverColor={'brand.default'}
                        icon="subscribe"
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

const PendingUsers = compose(togglePendingUserInFrequencyMutation)(
  PendingUsersWithMutation
);
export default connect()(PendingUsers);
