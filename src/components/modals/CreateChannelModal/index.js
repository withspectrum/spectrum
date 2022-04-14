// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import Modal from 'react-modal';
import compose from 'recompose/compose';
import { withRouter } from 'react-router';
import slugg from 'slugg';
import { CHANNEL_SLUG_DENY_LIST } from 'shared/slug-deny-lists';
import { withApollo } from 'react-apollo';
import { closeModal } from 'src/actions/modals';
import { addToastWithTimeout } from 'src/actions/toasts';
import { throttle } from 'src/helpers/utils';
import { getChannelBySlugAndCommunitySlugQuery } from 'shared/graphql/queries/channel/getChannel';
import type { GetChannelType } from 'shared/graphql/queries/channel/getChannel';
import type { GetCommunityType } from 'shared/graphql/queries/community/getCommunity';
import createChannelMutation from 'shared/graphql/mutations/channel/createChannel';
import type { Dispatch } from 'redux';
import { withCurrentUser } from 'src/components/withCurrentUser';

import ModalContainer from '../modalContainer';
import { TextButton, PrimaryOutlineButton } from 'src/components/button';
import { modalStyles, UpsellDescription } from '../styles';
import {
  whiteSpaceRegex,
  oddHyphenRegex,
} from 'src/views/viewHelpers/textValidationHelper';
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
};

type Props = {
  client: Object,
  dispatch: Dispatch<Object>,
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

    let hasInvalidChars = name.search(whiteSpaceRegex) >= 0;
    let hasOddHyphens = name.search(oddHyphenRegex) >= 0;
    if (hasInvalidChars || hasOddHyphens || name.length > 20) {
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

    if (CHANNEL_SLUG_DENY_LIST.indexOf(slug) > -1) {
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

    if (CHANNEL_SLUG_DENY_LIST.indexOf(slug) > -1) {
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
          if (CHANNEL_SLUG_DENY_LIST.indexOf(this.state.slug) > -1) {
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
        .catch(() => {
          // do nothing
        });
    }
  };

  changeDescription = e => {
    const description = e.target.value;

    let hasInvalidChars = description.search(whiteSpaceRegex) >= 0;
    let hasOddHyphens = description.search(oddHyphenRegex) >= 0;
    if (hasInvalidChars || hasOddHyphens || description.length >= 140) {
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
              <Error>
                Channel name has to be between 1 and 20 characters long and
                can`t have invalid characters.
              </Error>
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
                Oops, there may be some invalid characters or the text is too
                big (max: 140 characters) - try trimming that up.
              </Error>
            )}

            <Checkbox
              id="isPrivate"
              checked={isPrivate}
              onChange={this.changePrivate}
              dataCy="create-channel-modal-toggle-private-checkbox"
            >
              Private channel
            </Checkbox>

            <UpsellDescription>
              Private channels protect all conversations and messages, and all
              new members must be manually approved.
            </UpsellDescription>

            <Actions>
              <TextButton onClick={this.close}>Cancel</TextButton>
              <PrimaryOutlineButton
                disabled={!name || !slug || slugTaken}
                loading={loading}
                onClick={this.create}
              >
                {loading ? 'Creating...' : 'Create Channel'}
              </PrimaryOutlineButton>
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
  isOpen: state.modals.isOpen,
});
export default compose(
  // $FlowIssue
  connect(map),
  withApollo,
  withCurrentUser,
  createChannelMutation,
  withRouter
)(CreateChannelModal);
