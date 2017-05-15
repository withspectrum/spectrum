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
import { TextButton, Button } from '../../buttons';
import { modalStyles, Description } from '../styles';
import { closeModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import { createFrequencyMutation } from '../../../api/frequency';
import { Form, Actions } from './style';
import { Input, UnderlineInput, TextArea, Checkbox } from '../../formElements';

class CreateFrequencyModal extends Component {
  state = {
    name: '',
    slug: '',
    description: '',
    isPrivate: false,
  };

  close = () => {
    this.props.dispatch(closeModal());
  };

  handleChange = e => {
    const key = e.target.id;
    const value = e.target.value;
    const newState = {};

    // checkboxes should reverse the value
    if (key === 'isPrivate') {
      newState[key] = value === 'on' ? 'off' : 'on';
    } else {
      newState[key] = value;
    }

    this.setState(prevState => {
      return Object.assign({}, prevState, {
        ...newState,
      });
    });
  };

  create = e => {
    e.preventDefault();
    const { name, slug, description, isPrivate } = this.state;
    const { modalProps: { id }, modalProps } = this.props;
    const input = {
      community: id,
      name,
      slug,
      description,
      isPrivate,
    };

    this.props
      .createFrequency(input)
      .then(({ data: { createFrequency } }) => {
        this.props.history.push(`/${modalProps.slug}/${createFrequency.slug}`);
        this.close();
        this.props.dispatch(
          addToastWithTimeout('success', 'Frequency successfully created!')
        );
      })
      .catch(err => {
        this.props.dispatch(
          addToastWithTimeout(
            'error',
            'Oops, we ran into a problem creating a frequency.'
          )
        );
      });
  };

  render() {
    const { isOpen, modalProps } = this.props;
    const { name, slug, description, isPrivate } = this.state;
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
              id="name"
              defaultValue={name}
              onChange={this.handleChange}
              autoFocus={true}
            >
              Frequency Name
            </Input>
            <UnderlineInput defaultValue={slug} onChange={this.changeSlug}>
              {`sp.chat/${modalProps.slug}/`}
            </UnderlineInput>
            <TextArea
              id="slug"
              defaultValue={description}
              onChange={this.handleChange}
            >
              Description
            </TextArea>

            <Checkbox
              id="isPrivate"
              checked={isPrivate}
              onChange={this.handleChange}
            >
              Private channel
            </Checkbox>
            {isPrivate
              ? <Description>
                  Only approved people on Spectrum can see the stories, messages, and members in this channel. You can manually approve users who request to join this channel.
                </Description>
              : <Description>
                  Anyone on Spectrum can join this channel, post stories and messages, and will be able to see other members.
                </Description>}

            <Actions>
              <TextButton color={'warn.alt'}>Cancel</TextButton>
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
