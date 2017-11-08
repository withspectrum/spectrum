import React, { Component } from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import slugg from 'slugg';
import { CHANNEL_SLUG_BLACKLIST } from 'shared/slug-blacklists';
import { withApollo } from 'react-apollo';
import { track } from '../../../helpers/events';
import { closeModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import { throttle } from '../../../helpers/utils';
import {
  CHECK_UNIQUE_CHANNEL_SLUG_QUERY,
  createChannelMutation,
} from '../../../api/channel';

import ModalContainer from '../modalContainer';
import { TextButton, Button } from '../../buttons';
import { modalStyles, Description, UpsellDescription } from '../styles';
import {
  Input,
  UnderlineInput,
  TextArea,
  Error,
  Checkbox,
} from '../../formElements';
import { Form, Actions } from './style';

class CreateChannelModal extends Component {
  state: {
    name: string,
    slug: string,
    description: string,
    isPrivate: boolean,
    slugTaken: boolean,
    slugError: boolean,
    descriptionError: boolean,
    nameError: boolean,
    createError: boolean,
    loading: boolean,
  };

  constructor() {
    super();

    this.state = {
      name: '',
      slug: '',
      description: '',
      isPrivate: false,
      slugTaken: false,
      slugError: false,
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

    if (slug.length >= 24) {
      return this.setState({
        slugError: true,
      });
    }

    if (CHANNEL_SLUG_BLACKLIST.indexOf(slug) > -1) {
      return this.setState({
        slug,
        slugTaken: true,
      });
    }

    this.setState({
      slug,
      slugError: false,
    });

    this.checkSlug(slug);
  };

  checkSlug = slug => {
    const communitySlug = this.props.modalProps.slug;

    if (CHANNEL_SLUG_BLACKLIST.indexOf(slug) > -1) {
      return this.setState({
        slug,
        slugTaken: true,
      });
    } else {
      // check the db to see if this channel slug exists
      this.props.client
        .query({
          query: CHECK_UNIQUE_CHANNEL_SLUG_QUERY,
          variables: {
            channelSlug: slug,
            communitySlug,
          },
        })
        .then(({ data }) => {
          if (CHANNEL_SLUG_BLACKLIST.indexOf(this.state.slug) > -1) {
            return this.setState({
              slugTaken: true,
            });
          }

          if (!data.loading && data && data.channel && data.channel.id) {
            this.setState({
              slugTaken: true,
            });
          } else {
            this.setState({
              slugTaken: false,
            });
          }
        });
    }
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

  changePrivate = e => {
    const value = e.target.checked;

    this.setState({
      isPrivate: value,
    });
  };

  create = e => {
    e.preventDefault();
    const {
      name,
      slug,
      description,
      isPrivate,
      slugTaken,
      slugError,
      nameError,
      descriptionError,
    } = this.state;
    const { modalProps: { id }, modalProps } = this.props;

    // if an error is present, ensure the client cant submit the form
    if (slugTaken || nameError || descriptionError || slugError) {
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

    // all non-private channels should be set to default for now
    const isDefault = !isPrivate;

    // create the mutation input
    const input = {
      communityId: id,
      name,
      slug,
      description,
      isPrivate,
      isDefault,
    };

    this.props
      .createChannel(input)
      .then(({ data: { createChannel } }) => {
        track('channel', 'created', null);
        window.location.href = `/${modalProps.slug}/${createChannel.slug}`;
        this.close();
        this.props.dispatch(
          addToastWithTimeout('success', 'Channel successfully created!')
        );
      })
      .catch(err => {
        this.setState({
          loading: false,
        });

        this.props.dispatch(addToastWithTimeout('error', err.toString()));
      });
  };

  render() {
    const { isOpen, modalProps } = this.props;

    const {
      name,
      slug,
      description,
      isPrivate,
      slugTaken,
      slugError,
      nameError,
      descriptionError,
      createError,
      loading,
    } = this.state;
    const styles = modalStyles();

    return (
      <Modal
        isOpen={isOpen}
        contentLabel={'Create a Channel'}
        onRequestClose={this.close}
        shouldCloseOnOverlayClick={true}
        style={styles}
        closeTimeoutMS={330}
      >
        {/*
          We pass the closeModal dispatch into the container to attach
          the action to the 'close' icon in the top right corner of all modals
        */}
        <ModalContainer title={'Create a Channel'} closeModal={this.close}>
          <Form>
            <Input
              id="name"
              defaultValue={name}
              onChange={this.changeName}
              autoFocus={true}
            >
              Channel Name
            </Input>

            {nameError && (
              <Error>Channel names can be up to 20 characters long.</Error>
            )}

            <UnderlineInput defaultValue={slug} onChange={this.changeSlug}>
              {`/${modalProps.slug}/`}
            </UnderlineInput>

            {slugTaken && (
              <Error>
                This url is already taken - feel free to change it if you're set
                on the name {name}!
              </Error>
            )}

            {slugError && <Error>Slugs can be up to 24 characters long.</Error>}

            <TextArea
              id="slug"
              defaultValue={description}
              onChange={this.changeDescription}
            >
              Describe it in 140 characters or less
            </TextArea>

            {descriptionError && (
              <Error>
                Oop, that's more than 140 characters - try trimming that up.
              </Error>
            )}

            <Checkbox
              id="isPrivate"
              checked={isPrivate}
              onChange={this.changePrivate}
              disabled={!modalProps.isPro}
            >
              Private channel
            </Checkbox>

            {!modalProps.isPro && (
              <UpsellDescription>
                Standard communities can create private channels to protect
                threads, messages, and manually approve all new members.
                <Link onClick={this.close} to={`/${modalProps.slug}/settings`}>
                  Learn more
                </Link>
              </UpsellDescription>
            )}

            {modalProps.isPro &&
              isPrivate && (
                <Description>
                  Only approved people on Spectrum can see the threads,
                  messages, and members in this channel. You can manually
                  approve users who request to join this channel.
                </Description>
              )}

            {modalProps.isPro &&
              !isPrivate && (
                <Description>
                  Anyone on Spectrum can join this channel, post threads and
                  messages, and will be able to see other members.
                </Description>
              )}

            <Actions>
              <TextButton color={'warn.alt'}>Cancel</TextButton>
              <Button
                disabled={!name || !slug || slugTaken || !description}
                loading={loading}
                onClick={this.create}
              >
                Save
              </Button>
            </Actions>

            {createError && (
              <Error>
                Please fix any errors above before creating this community.
              </Error>
            )}
          </Form>
        </ModalContainer>
      </Modal>
    );
  }
}

const CreateChannelModalWithMutation = compose(
  createChannelMutation,
  withRouter
)(CreateChannelModal);

const mapStateToProps = state => ({
  isOpen: state.modals.isOpen,
  modalProps: state.modals.modalProps,
});

const CreateChannelModalWithState = connect(mapStateToProps)(
  CreateChannelModalWithMutation
);
const CreateChannelModalWithQuery = withApollo(CreateChannelModalWithState);
export default CreateChannelModalWithQuery;
