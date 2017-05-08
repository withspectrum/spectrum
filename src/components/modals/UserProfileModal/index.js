// @flow
import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import Modal from 'react-modal';
import ModalContainer from '../modalContainer';
import { modalStyles } from '../styles';
import { closeModal } from '../../../actions/modals';

class UserProfileModal extends React.Component {
  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  render() {
    // invoke the modalStyles function to return an object
    const styles = modalStyles();

    return (
      <Modal
        isOpen={this.props.isOpen}
        contentLabel={'modal!'}
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        {/*
          We pass the closeModal dispatch into the container to attach
          the action to the 'close' icon in the top right corner of all modals
        */}
        <ModalContainer closeModal={'foo'}>
          Made it in!
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
  modalProps: state.modals.modalProps,
});

export default connect(mapStateToProps)(UserProfileModal);
