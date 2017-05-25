// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
import Modal from 'react-modal';
// $FlowFixMe
import compose from 'recompose/compose';

import { closeModal } from '../../../actions/modals';
import { initNewThreadWithUser } from '../../../actions/directMessageThreads';
import { uploadProfilePhotoMutation } from '../../../api/user';

import ModalContainer from '../modalContainer';
import { modalStyles } from '../styles';
import Icon from '../../../components/icons';
import { Button } from '../../../components/buttons';
import {
  HiddenInput,
  Row,
  ImageInputLabel,
  ProfileImage,
  InputOverlay,
} from './style';

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
      return;
    }

    this.props.uploadProfilePhoto(file);
  };

  initMessage = () => {
    const userToSend = this.props.user;
    this.props.dispatch(initNewThreadWithUser(userToSend));
    this.props.history.push('/messages/new');
    this.props.dispatch(closeModal());
  };

  render() {
    const { user, isOpen, currentUser } = this.props;
    const styles = modalStyles();

    return (
      <Modal
        isOpen={isOpen}
        contentLabel={user.name}
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

          {/*
            if the current user is viewing their own profile, show an
            editable state, otherwise we will just show a normal user profile
             */}
          {currentUser.id === user.id
            ? <Row>
                <ImageInputLabel>
                  <InputOverlay>
                    <Icon glyph="photo" />
                  </InputOverlay>
                  {user.profilePhoto &&
                    <ProfileImage
                      src={user.profilePhoto}
                      role="presentation"
                    />}
                  <HiddenInput
                    type="file"
                    id="file"
                    name="file"
                    accept=".png, .jpg, .jpeg, .gif, .mp4"
                    multiple={false}
                    onChange={this.stageProfilePhotoForUpload}
                  />
                </ImageInputLabel>
              </Row>
            : <Row>
                {user.profilePhoto &&
                  <ProfileImage src={user.profilePhoto} role="presentation" />}
                <Button onClick={this.initMessage}>Message</Button>
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
export default compose(connect(mapStateToProps), withRouter)(
  UserProfileModalWithMutation
);
