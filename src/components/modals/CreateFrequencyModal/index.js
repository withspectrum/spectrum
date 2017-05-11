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
import { createFrequencyMutation } from '../../../api/frequency';
import { Form, Actions } from './style';
import { Input, UnderlineInput, TextArea } from '../../formElements';

class CreateFrequencyModal extends Component {
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
    const { modalProps: { id }, modalProps } = this.props;
    const input = {
      community: id,
      name,
      slug,
      description,
    };

    this.props
      .createFrequency(input)
      .then(frequency => {
        this.props.history.push(`/${modalProps.slug}/${frequency.slug}`);
        this.close();
      })
      .catch(err => {
        //TODO: Add dispatch for global error events
        console.log('err in createFrequency', err);
      });
  };

  render() {
    const { isOpen, modalProps } = this.props;
    const { name, slug, description } = this.state;
    const styles = modalStyles();

    return (
      <Modal
        isOpen={isOpen}
        contentLabel={'Create a Frequency'}
        onRequestClose={this.close}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        {/*
          We pass the closeModal dispatch into the container to attach
          the action to the 'close' icon in the top right corner of all modals
        */}
        <ModalContainer title={'Create a Frequency'} closeModal={this.close}>
          <Form>
            <Input
              defaultValue={name}
              onChange={this.changeName}
              autoFocus={true}
            >
              Frequency Name
            </Input>
            <UnderlineInput defaultValue={slug} onChange={this.changeSlug}>
              {`sp.chat/${modalProps.slug}/`}
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

const CreateFrequencyModalWithMutation = compose(
  createFrequencyMutation,
  withRouter
)(CreateFrequencyModal);

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
  modalProps: state.modals.modalProps,
});
export default connect(mapStateToProps)(CreateFrequencyModalWithMutation);
