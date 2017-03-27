import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import ModalContainer from '../ModalContainer';
import { closeModal } from '../../../actions/modals';
import history from '../../../helpers/history';
import { toggleMessageComposer } from '../../../actions/messageComposer';
import { modalStyles } from '../FrequencyEditModal/style';
import { Button } from '../../Globals';

class UserProfileModal extends React.Component {
  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  toggleMessageComposer = () => {
    history.push(`/messages`);
    this.props.dispatch(toggleMessageComposer());
    setTimeout(
      () => {
        this.props.dispatch(closeModal());
      },
      50,
    ); // make sure we dispatch before this modal unmounts
  };

  render() {
    const { user, loading, modalProps, userProfile } = this.props;

    return (
      <Modal
        isOpen={this.props.isOpen}
        contentLabel={userProfile.displayName}
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >
        <ModalContainer
          title={userProfile.displayName}
          closeModal={this.closeModal}
        >

          <Button onClick={this.toggleMessageComposer} width={'100%'}>
            Message
          </Button>
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  loading: state.loading,
  isOpen: state.modals.isOpen,
});

export default connect(mapStateToProps)(UserProfileModal);
