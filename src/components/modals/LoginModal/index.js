// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import Modal from 'react-modal';
import { getItemFromStorage, storeItem } from '../../../helpers/localStorage';
import { SERVER_URL } from '../../../api';
import { track } from '../../../helpers/events';
import { closeModal } from '../../../actions/modals';
import ModalContainer from '../modalContainer';
import { modalStyles } from '../styles';
import Icon from '../../../components/icons';
import {
  SignInButtons,
  Description,
  ButtonTwitter,
  ButtonFacebook,
  ButtonGoogle,
} from './style';

class LoginModal extends Component {
  close = () => {
    this.props.dispatch(closeModal());
  };

  login = method => {
    // log the user in and return them to this page
    storeItem('preferred_signin_method', method);
  };

  render() {
    const { isOpen, modalProps } = this.props;
    const styles = modalStyles(300);
    const preferredSigninMethod = getItemFromStorage('preferred_signin_method');

    return (
      <Modal
        isOpen={isOpen}
        contentLabel={'Sign up or log in'}
        onRequestClose={this.close}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        <ModalContainer title={'Sign up or log in'} closeModal={this.close}>
          <Description>
            Sign up or log in below to join the conversation
          </Description>
          {preferredSigninMethod &&
            <SignInButtons>
              <ButtonTwitter
                preferred={preferredSigninMethod === 'twitter'}
                after={preferredSigninMethod === 'twitter'}
                whitebg={preferredSigninMethod !== 'twitter'}
                href={`${SERVER_URL}/auth/twitter?r=${window.location.href}`}
                onClick={() => this.login('twitter')}
              >
                <Icon glyph="twitter" />
                {' '}
                <span>Sign in with Twitter</span>
              </ButtonTwitter>

              <ButtonFacebook
                preferred={preferredSigninMethod === 'facebook'}
                whitebg={preferredSigninMethod !== 'facebook'}
                after={preferredSigninMethod === 'facebook'}
                href={`${SERVER_URL}/auth/facebook?r=${window.location.href}`}
                onClick={() => this.login('facebook')}
              >
                <Icon glyph="facebook" />
                {' '}
                <span>Sign in with Facebook</span>
              </ButtonFacebook>

              <ButtonGoogle
                preferred={preferredSigninMethod === 'google'}
                whitebg={preferredSigninMethod !== 'google'}
                after={preferredSigninMethod === 'google'}
                href={`${SERVER_URL}/auth/google?r=${window.location.href}`}
                onClick={() => this.login('google')}
              >
                <Icon glyph="google" />
                {' '}
                <span>Sign in with Google</span>
              </ButtonGoogle>
            </SignInButtons>}

          {!preferredSigninMethod &&
            <SignInButtons>
              <ButtonTwitter
                preferred
                after={preferredSigninMethod === 'twitter'}
                href={`${SERVER_URL}/auth/twitter?r=${window.location.href}`}
                onClick={() => this.login('twitter')}
              >
                <Icon glyph="twitter" />
                {' '}
                <span>Sign in with Twitter</span>
              </ButtonTwitter>

              <ButtonFacebook
                preferred
                after={preferredSigninMethod === 'facebook'}
                href={`${SERVER_URL}/auth/facebook?r=${window.location.href}`}
                onClick={() => this.login('facebook')}
              >
                <Icon glyph="facebook" />
                {' '}
                <span>Sign in with Facebook</span>
              </ButtonFacebook>

              <ButtonGoogle
                preferred
                after={preferredSigninMethod === 'google'}
                href={`${SERVER_URL}/auth/google?r=${window.location.href}`}
                onClick={() => this.login('google')}
              >
                <Icon glyph="google" />
                {' '}
                <span>Sign in with Google</span>
              </ButtonGoogle>
            </SignInButtons>}
        </ModalContainer>
      </Modal>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
  modalProps: state.modals.modalProps,
});

export default connect(mapStateToProps)(LoginModal);
