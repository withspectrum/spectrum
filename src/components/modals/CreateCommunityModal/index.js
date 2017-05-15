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
import { modalStyles } from '../styles';
import { closeModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import { createCommunityMutation } from '../../../api/community';
import { Form, Actions, ImgPreview } from './style';
import { Input, UnderlineInput, TextArea } from '../../formElements';

class CreateCommunityModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: props.modalProps.name || '',
      slug: '',
      description: '',
      website: '',
      image: '',
      file: null,
    };
  }

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

  changeWebsite = e => {
    const website = e.target.value;
    this.setState({
      website,
    });
  };

  setCommunityPhoto = e => {
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        image: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  create = e => {
    e.preventDefault();
    const { name, slug, description, website, file } = this.state;
    const input = {
      name,
      slug,
      description,
      website,
      file,
    };
    this.props
      .createCommunity(input)
      .then(community => {
        this.props.history.push(`/${slug}`);
        this.close();
        this.props.dispatch(
          addToastWithTimeout('success', 'Community created!')
        );
      })
      .catch(err => {
        this.props.dispatch(addToastWithTimeout('error', "You can't do that!"));
      });
  };

  render() {
    const { isOpen } = this.props;
    const { name, slug, description, image, website } = this.state;
    const styles = modalStyles();

    return (
      <Modal
        isOpen={isOpen}
        contentLabel={'Create a new community'}
        onRequestClose={this.close}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        {/*
          We pass the closeModal dispatch into the container to attach
          the action to the 'close' icon in the top right corner of all modals
        */}
        <ModalContainer
          title={'Create a new community'}
          closeModal={this.close}
        >
          <Form>
            <Input
              defaultValue={name}
              onChange={this.changeName}
              autoFocus={true}
            >
              What is your community called?
            </Input>
            <UnderlineInput defaultValue={slug} onChange={this.changeSlug}>
              sp.chat/
            </UnderlineInput>
            <TextArea
              defaultValue={description}
              onChange={this.changeDescription}
            >
              Describe it in 140 characters or less
            </TextArea>

            <Input
              inputType="file"
              accept=".png, .jpg, .jpeg, .gif"
              defaultValue={name}
              onChange={this.setCommunityPhoto}
              multiple={false}
            >
              Add a logo or photo

              {!image ? <span>add</span> : <ImgPreview src={image} />}
            </Input>

            <Input
              defaultValue={website}
              onChange={this.changeWebsite}
              autoFocus={true}
            >
              Optional: Add your community's website
            </Input>

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

const CreateCommunityModalWithMutation = compose(
  createCommunityMutation,
  withRouter
)(CreateCommunityModal);

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
  modalProps: state.modals.modalProps,
});
export default connect(mapStateToProps)(CreateCommunityModalWithMutation);
