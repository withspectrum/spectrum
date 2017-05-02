import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import ModalContainer from '../ModalContainer';
import { closeModal } from '../../../actions/modals';
import history from '../../../helpers/history';
import { toggleMessageComposer } from '../../../actions/messageComposer';
import { modalStyles } from '../FrequencyEditModal/style';
import { Button } from '../../Globals';
import { getUserInfo } from '../../../db/users';
import {
  getMessageGroups,
  checkMessageGroupForUsersMatch,
} from '../../../db/messageGroups';

class UserProfileModal extends React.Component {
  state = {
    recipient: null,
    messageId: null,
    loading: false,
  };

  componentWillMount() {
    this.populateModal();
  }

  componentWillUnmount() {
    this.setState({
      recipient: null,
      messageId: null,
      loading: false,
    });
  }

  populateModal = () => {
    const { modalProps: { user }, user: { uid } } = this.props;
    const recipient = user;
    getUserInfo(recipient)
      .then(recipient => {
        this.setState({
          recipient,
          loading: true,
        });
        return recipient;
      })
      .then(recipient => {
        getMessageGroups(uid).then(messageGroups => {
          if (!messageGroups) {
            this.setState({
              messageId: null,
              loading: false,
            });

            return;
          }
          // use .some() because it will break when a check returns true, so that
          // we don't keep iterating over messageGroups unnecessiarly
          Object.keys(messageGroups).map(group =>
            checkMessageGroupForUsersMatch(
              group,
              uid,
              recipient.uid
            ).then(id => {
              // if an id is returned here, it means that the current user already
              // has a thread with the user profile that is being viewed
              if (id !== undefined) {
                this.setState({
                  messageId: id,
                  loading: false,
                });
                return;
              } else {
                this.setState({
                  loading: false,
                });
              }
            })
          );
        });
      });
  };

  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  handleClick = () => {
    const messageId = this.state.messageId;
    const recipient = this.state.recipient;

    if (messageId !== null && messageId !== undefined) {
      this.props.dispatch({
        type: 'CLEAR_ACTIVE_STORY',
      });

      history.push(`/messages/${messageId}`);
    } else {
      this.props.dispatch({
        type: 'CLEAR_ACTIVE_STORY',
      });

      history.push(`/messages`);

      this.props.dispatch({
        type: 'SET_MESSAGE_COMPOSER_RECIPIENT',
        recipient,
      });

      this.props.dispatch(toggleMessageComposer());
    }

    setTimeout(() => {
      this.props.dispatch(closeModal());
    }, 50); // make sure we dispatch before this modal unmounts
  };

  render() {
    const { modalProps: { user }, user: { uid } } = this.props;
    const recipient = user;
    const displayName = this.state.recipient
      ? this.state.recipient.displayName
      : 'Loading...';

    return (
      <Modal
        isOpen={this.props.isOpen}
        contentLabel={displayName}
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >
        <ModalContainer
          user={this.state.recipient}
          title={displayName}
          closeModal={this.closeModal}
        >

          {recipient !== uid
            ? this.state.loading
                ? <Button disabled width={'100%'}>
                    Message
                  </Button>
                : <Button onClick={this.handleClick} width={'100%'}>
                    Message
                  </Button>
            : <Button disabled width={'100%'}>
                Don't talk to yourself, ya dingus
              </Button>}
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  isOpen: state.modals.isOpen,
  modalProps: state.modals.modalProps,
});

export default connect(mapStateToProps)(UserProfileModal);
