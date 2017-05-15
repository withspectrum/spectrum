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
// $FlowFixMe
import slugg from 'slugg';
// $FlowFixMe
import { withApollo } from 'react-apollo';
import ModalContainer from '../modalContainer';
import { LinkButton, Button } from '../../buttons';
import { modalStyles } from '../styles';
import { closeModal } from '../../../actions/modals';
import { throttle } from '../../../helpers/utils';
import { addToastWithTimeout } from '../../../actions/toasts';
import {
  createCommunityMutation,
  CHECK_UNIQUE_COMMUNITY_SLUG_QUERY,
} from '../../../api/community';
import { Form, Actions, ImgPreview } from './style';
import { Input, UnderlineInput, TextArea, Error } from '../../formElements';

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
      slugTaken: false,
      descriptionError: false,
      nameError: false,
      createError: false,
      loading: false,
    };

    this.checkSlug = throttle(this.checkSlug, 500);
  }

  close = () => {
    this.props.dispatch(closeModal());
  };

  changeName = e => {
    const name = e.target.value;
    let lowercaseName = name.toLowerCase().trim();
    let slug = slugg(lowercaseName);

    if (name.length >= 20) {
      this.setState({
        nameError: true,
      });

      return;
    }

    this.setState({
      name,
      slug,
      nameError: false,
    });

    this.checkSlug(slug);
  };

  changeSlug = e => {
    let slug = e.target.value;
    let lowercaseSlug = slug.toLowerCase().trim();
    slug = slugg(lowercaseSlug);

    console.log('updating slug state with ', slug);

    this.setState({
      slug,
    });

    this.checkSlug(slug);
  };

  checkSlug = slug => {
    // check the db to see if this frequency slug exists
    this.props.client
      .query({
        query: CHECK_UNIQUE_COMMUNITY_SLUG_QUERY,
        variables: {
          slug,
        },
      })
      .then(({ data }) => {
        // if the community exists
        if (!data.loading && data && data.community && data.community.id) {
          this.setState({
            slugTaken: true,
          });
        } else {
          this.setState({
            slugTaken: false,
          });
        }
      });
  };

  changeDescription = e => {
    const description = e.target.value;
    if (description.length >= 140) {
      this.setState({
        descriptionError: true,
      });
      return;
    }

    this.setState({
      description,
      descriptionError: false,
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
    const {
      name,
      slug,
      description,
      website,
      file,
      slugTaken,
      nameError,
      descriptionError,
    } = this.state;

    // if an error is present, ensure the client cant submit the form
    if (slugTaken || nameError || descriptionError) {
      this.setState({
        createError: true,
      });

      return;
    }

    // clientside checks have passed
    this.setState({
      createError: false,
      loading: true,
    });

    // create the mutation input
    const input = {
      name,
      slug,
      description,
      website,
      file,
    };

    // create the community
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
        this.props.dispatch(addToastWithTimeout('error', err));
      });
  };

  render() {
    const { isOpen } = this.props;
    const {
      name,
      slug,
      description,
      image,
      website,
      slugTaken,
      nameError,
      descriptionError,
      createError,
      loading,
    } = this.state;
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

            {nameError &&
              <Error>Community names can be up to 20 characters long.</Error>}

            <UnderlineInput defaultValue={slug} onChange={this.changeSlug}>
              sp.chat/
            </UnderlineInput>

            {slugTaken &&
              <Error>
                This url is already taken - feel free to change it if
                you're set on the name {name}!
              </Error>}

            <TextArea
              defaultValue={description}
              onChange={this.changeDescription}
            >
              Describe it in 140 characters or less
            </TextArea>

            {descriptionError &&
              <Error>
                Oop, that's more than 140 characters - try trimming that up.
              </Error>}

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
              <LinkButton color={'warn.alt'}>Cancel</LinkButton>
              <Button
                disabled={!name || !slug || slugTaken || !description}
                loading={loading}
                onClick={this.create}
              >
                Save
              </Button>
            </Actions>

            {createError &&
              <Error>
                Please fix any errors above before creating this community.
              </Error>}
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

const CreateCommunityModalWithState = connect(mapStateToProps)(
  CreateCommunityModalWithMutation
);
const CreateCommunityModalWithQuery = withApollo(CreateCommunityModalWithState);
export default CreateCommunityModalWithQuery;
