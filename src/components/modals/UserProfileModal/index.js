// @flow
import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import Modal from 'react-modal';
// $FlowFixMe
import branch from 'recompose/branch';
// $FlowFixMe
import renderComponent from 'recompose/renderComponent';
import ModalContainer from '../modalContainer';
import { LoadingCard } from '../../loading';
import { modalStyles } from '../styles';
import { closeModal } from '../../../actions/modals';

const UserProfileModal = ({ user, dispatch, isOpen }) => {
  const styles = modalStyles();
  const close = () => {
    dispatch(closeModal());
  };

  return (
    <Modal
      isOpen={isOpen}
      contentLabel={user.displayName}
      onRequestClose={close}
      shouldCloseOnOverlayClick={true}
      style={styles}
      closeTimeoutMS={330}
    >
      {/*
        We pass the closeModal dispatch into the container to attach
        the action to the 'close' icon in the top right corner of all modals
      */}
      <ModalContainer title={user.displayName} closeModal={'foo'}>
        <img src={user.photoURL} width="40" height="40" />
        <span>{user.username}</span>
      </ModalContainer>
    </Modal>
  );
};

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
  modalProps: state.modals.modalProps,
});
export default connect(mapStateToProps)(UserProfileModal);
