// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import Modal from 'react-modal';
// $FlowFixMe
import compose from 'recompose/compose';
import ModalContainer from '../modalContainer';
import { modalStyles } from '../styles';
import {
  HiddenInput,
  Row,
  ImageInputLabel,
  ProfileImage,
  InputOverlay,
} from './style';
import Icon from '../../../components/icons';
import { closeModal } from '../../../actions/modals';
import { uploadProfilePhotoMutation } from '../../../api/user';

class UserProfileModal extends Component {
  state = {
    image: {
      type: null,
      name: null,
    },
    uploader: {
      error: false,
      errorMessage: null,
      loading: false,
    },
  };

  close = () => {
    this.props.dispatch(closeModal());
  };

  stageProfilePhotoForUpload = e => {
    const file = e.target.files[0];

    if (file.size > 3000000) {
      console.log('too big of a file');
      return;
    }
    console.log('file', file);
    this.props.uploadProfilePhoto(file);
  };

  render() {
    const { user, isOpen, currentUser } = this.props;
    const styles = modalStyles();

    return (
      <Modal
        isOpen={isOpen}
        contentLabel={user.displayName}
        onRequestClose={this.close}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        {/*
          We pass the closeModal dispatch into the container to attach
          the action to the 'close' icon in the top right corner of all modals
        */}
        <ModalContainer title={'Edit profile'} closeModal={this.close}>

          {currentUser.id === user.id &&
            <Row>
              <ImageInputLabel>
                <InputOverlay>
                  <Icon glyph="photo" />
                </InputOverlay>
                {user.profilePhoto &&
                  <ProfileImage src={user.profilePhoto} role="presentation" />}
                <HiddenInput
                  type="file"
                  id="file"
                  name="file"
                  accept=".png, .jpg, .jpeg, .gif, .mp4"
                  multiple={false}
                  onChange={this.stageProfilePhotoForUpload}
                />
              </ImageInputLabel>
            </Row>}
        </ModalContainer>
      </Modal>
    );
  }
}

const UserProfileModalWithMutation = compose(uploadProfilePhotoMutation)(
  UserProfileModal
);

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
  modalProps: state.modals.modalProps,
  currentUser: state.users.currentUser,
});
export default connect(mapStateToProps)(UserProfileModalWithMutation);
