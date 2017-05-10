// @flow
import React, { Component } from 'react';
// $FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import Modal from 'react-modal';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import { withRouter } from 'react-router';
import ModalContainer from '../modalContainer';
import { LinkButton, Button } from '../../buttons';
import { modalStyles } from '../styles';
import { closeModal } from '../../../actions/modals';
import { createCommunityMutation } from '../../../api/community';
import { Form, Actions } from './style';
import { Input, UnderlineInput, TextArea } from '../../formElements';

class CreateCommunityModal extends Component {
  state = {
    name: '',
    slug: '',
    description: '',
  };

  close = () => {
    this.props.dispatch(closeModal());
  };

  changeName = e => {
    const name = e.target.value;
    this.setState({
      name,
    });
  };

  changeDescription = e => {
    const description = e.target.value;
    this.setState({
      description,
    });
  };

  changeSlug = e => {
    const slug = e.target.value;
    this.setState({
      slug,
    });
  };

  create = e => {
    e.preventDefault();
    const { name, slug, description } = this.state;
    const input = {
      name,
      slug,
      description,
    };
    this.props
      .createCommunity(input)
      .then(community => {
        this.props.history.push(`/${community.slug}`);
        this.close();
      })
      .catch(err => {
        //TODO: Add dispatch for global error events
        console.log('err in createCommunity', err);
      });
  };

  render() {
    const { isOpen } = this.props;
    const { name, slug, description } = this.state;
    const styles = modalStyles();

    return (
      <Modal
        isOpen={isOpen}
        contentLabel={'Create a Community'}
        onRequestClose={this.close}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        {/*
          We pass the closeModal dispatch into the container to attach
          the action to the 'close' icon in the top right corner of all modals
        */}
        <ModalContainer title={'Create a Community'} closeModal={this.close}>
          <Form>
            <Input
              defaultValue={name}
              onChange={this.changeName}
              autoFocus={true}
            >
              Community Name
            </Input>
            <UnderlineInput defaultValue={slug} onChange={this.changeSlug}>
              sp.chat/
            </UnderlineInput>
            <TextArea
              defaultValue={description}
              onChange={this.changeDescription}
            >
              Description
            </TextArea>
            <Actions>
              <LinkButton color={'warn.alt'}>Cancel</LinkButton>
              <Button onClick={this.create}>Save</Button>
            </Actions>
          </Form>
        </ModalContainer>
      </Modal>
    );
  }
}

const CreateCommunityModalWithMutation = compose(
  createCommunityMutation,
  withRouter
)(CreateCommunityModal);

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
  modalProps: state.modals.modalProps,
});
export default connect(mapStateToProps)(CreateCommunityModalWithMutation);
