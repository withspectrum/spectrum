import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import ModalContainer from '../ModalContainer';
import { closeModal } from '../../../actions/modals';
import { downgradeUser } from '../../../actions/user';
import { modalStyles, Footer, ErrorMessage } from '../FrequencyEditModal/style';
import { Label, Input } from '../../Globals';
import { Button } from '../../Globals';

class EditAccountModal extends React.Component {
  closeModal = () => {
    this.props.dispatch(closeModal());
  };

  downgrade = () => {
    this.props.dispatch(downgradeUser());
  };

  render() {
    return (
      <Modal
        isOpen={this.props.isOpen}
        contentLabel="My Account"
        onRequestClose={this.closeModal}
        shouldCloseOnOverlayClick={true}
        style={modalStyles}
        closeTimeoutMS={330}
      >
        <ModalContainer title={`My Account`} closeModal={this.closeModal}>
          <div onClick={this.downgrade}>downgrade</div>
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  isOpen: state.modals.isOpen,
});

export default connect(mapStateToProps)(EditAccountModal);
