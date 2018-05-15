// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import slugg from 'slugg';
import { CHANNEL_SLUG_BLACKLIST } from 'shared/slug-blacklists';
import { withApollo } from 'react-apollo';
import { closeModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import { throttle } from '../../../helpers/utils';
import { getChannelBySlugAndCommunitySlugQuery } from 'shared/graphql/queries/channel/getChannel';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import createChannelMutation from 'shared/graphql/mutations/channel/createChannel';
import StripeModalWell from 'src/components/stripeCardForm/modalWell';
import { track, events, transformations } from 'src/helpers/analytics';

import ModalContainer from '../modalContainer';
import { TextButton, Button } from '../../buttons';
import { modalStyles, UpsellDescription } from '../styles';
import {
  Input,
  UnderlineInput,
  TextArea,
  Error,
  Checkbox,
} from '../../formElements';
import { Form, Actions } from './style';

type State = {
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
  hasChargeableSource: boolean,
};

type Props = {
  client: Object,
  dispatch: Function,
  isOpen: boolean,
  community: GetCommunityType,
  createChannel: Function,
};

class CreateChannelModal extends React.Component<Props, State> {
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
      hasChargeableSource: false,
    };

    this.checkSlug = throttle(this.checkSlug, 500);
  }

  componentDidMount() {
    const { community } = this.props;
    track(events.CHANNEL_CREATED_INITED, {
      community: transformations.analyticsCommunity(community),
    });
  }

  close = () => {
    this.props.dispatch(closeModal());
  };

  onSourceAvailable = () => this.setState({ hasChargeableSource: true });

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

    // $FlowIssue
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

    // $FlowIssue
    this.checkSlug(slug);
  };

  checkSlug = (slug: string) => {
    const communitySlug = this.props.community.slug;

    if (CHANNEL_SLUG_BLACKLIST.indexOf(slug) > -1) {
      return this.setState({
        slug,
        slugTaken: true,
      });
    } else {
      // check the db to see if this channel slug exists
      this.props.client
        .query({
          query: getChannelBySlugAndCommunitySlugQuery,
          variables: {
            channelSlug: slug,
            communitySlug,
          },
        })
        .then(({ data }: { data: { channel: GetChannelType } }) => {
          if (CHANNEL_SLUG_BLACKLIST.indexOf(this.state.slug) > -1) {
            return this.setState({
              slugTaken: true,
            });
          }

          if (!data.loading && data && data.channel && data.channel.id) {
            return this.setState({
              slugTaken: true,
            });
          } else {
            return this.setState({
              slugTaken: false,
            });
          }
        })
        .catch(err => {
          return this.props.dispatch(
            addToastWithTimeout('error', err.toString())
          );
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
    const { community } = this.props;

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
      communityId: community.id,
      name,
      slug,
      description,
      isPrivate,
      isDefault,
    };

    this.props
      .createChannel(input)
      .then(() => {
        this.close();
        this.props.dispatch(
          addToastWithTimeout('success', 'Channel successfully created!')
        );
        return;
      })
      .catch(err => {
        this.setState({
          loading: false,
        });

        this.props.dispatch(addToastWithTimeout('error', err.toString()));
      });
  };

  render() {
    const { isOpen, community } = this.props;

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
      hasChargeableSource,
    } = this.state;

    const styles = modalStyles(420);

    return (
      <Modal
        /* TODO(@mxstbr): Fix this */
        ariaHideApp={false}
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
              {`/${community.slug}/`}
            </UnderlineInput>

            {slugTaken && (
              <Error>
                This url is already taken - feel free to change it if you’re set
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
                Oop, that’s more than 140 characters - try trimming that up.
              </Error>
            )}

            <Checkbox
              id="isPrivate"
              checked={isPrivate}
              onChange={this.changePrivate}
              dataCy="create-channel-modal-toggle-private-checkbox"
            >
              Private channel · $10/mo
            </Checkbox>

            {isPrivate && (
              <StripeModalWell
                id={community.id}
                onSourceAvailable={this.onSourceAvailable}
                closeModal={this.close}
              />
            )}

            <UpsellDescription>
              Private channels protect all conversations and messages, and all
              new members must be manually approved.
            </UpsellDescription>

            <Actions>
              <TextButton onClick={this.close} color={'warn.alt'}>
                Cancel
              </TextButton>
              <Button
                disabled={
                  !name ||
                  !slug ||
                  slugTaken ||
                  !description ||
                  (isPrivate && !hasChargeableSource)
                }
                loading={loading}
                onClick={this.create}
              >
                Create Channel
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

const map = state => ({
  currentUser: state.users.currentUser,
  isOpen: state.modals.isOpen,
});
export default compose(
  // $FlowIssue
  connect(map),
  withApollo,
  createChannelMutation,
  withRouter
)(CreateChannelModal);
