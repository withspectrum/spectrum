import React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import ModalContainer from '../ModalContainer';
import { closeModal } from '../../../actions/modals';
import { modalStyles } from '../FrequencyEditModal/style';
import { Button } from '../../Globals';

class UserProfileModal extends React.Component {
  closeModal = () => {
    this.props.dispatch(closeModal());
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
          <Link to={`/messages/new/${userProfile.username}`}>
            <Button width={'100%'}>
              Message
            </Button>
          </Link>
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
