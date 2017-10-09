import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';
import { track } from '../../../helpers/events';
import {
  editCommunityMutation,
  deleteCommunityMutation,
} from '../../../api/community';
import { openModal } from '../../../actions/modals';
import { addToastWithTimeout } from '../../../actions/toasts';
import { Button, TextButton, IconButton } from '../../../components/buttons';
import { Notice } from '../../../components/listItems/style';
import Icon from '../../../components/icons';
import {
  Input,
  UnderlineInput,
  TextArea,
  PhotoInput,
  Error,
  CoverInput,
} from '../../../components/formElements';
import {
  StyledCard,
  Form,
  FormTitle,
  Description,
  Actions,
  TertiaryActionContainer,
  ImageInputWrapper,
  Location,
} from '../../../components/editForm/style';
import { SectionCard, SectionCardFooter, SectionTitle } from '../style';

type Props = {};
class EditForm extends React.Component<Props> {
  state: {
    name: string,
    slug: string,
    description: string,
    communityId: string,
    website: string,
    image: string,
    coverPhoto: string,
    file: ?Object,
    coverFile: ?Object,
    communityData: Object,
    photoSizeError: boolean,
    nameError: boolean,
    isLoading: boolean,
  };

  constructor(props) {
    super(props);

    const { community } = this.props;
    this.state = {
      name: community.name,
      slug: community.slug,
      description: community.description,
      communityId: community.id,
      website: community.website,
      image: community.profilePhoto,
      coverPhoto: community.coverPhoto,
      file: null,
      coverFile: null,
      nameError: false,
      communityData: community,
      photoSizeError: false,
      isLoading: false,
    };
  }

  changeName = e => {
    const name = e.target.value;

    if (name.length >= 20) {
      this.setState({
        name,
        nameError: true,
      });

      return;
    }

    this.setState({
      name,
      nameError: false,
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

    this.setState({
      isLoading: true,
    });

    if (file && file.size > 3000000) {
      return this.setState({
        photoSizeError: true,
        isLoading: false,
      });
    }

    reader.onloadend = () => {
      track('community', 'profile photo uploaded', null);

      this.setState({
        file: file,
        image: reader.result,
        photoSizeError: false,
        isLoading: false,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  setCommunityCover = e => {
    let reader = new FileReader();
    let file = e.target.files[0];

    this.setState({
      isLoading: true,
    });

    if (file && file.size > 3000000) {
      return this.setState({
        photoSizeError: true,
        isLoading: false,
      });
    }

    reader.onloadend = () => {
      track('community', 'cover photo uploaded', null);

      this.setState({
        coverFile: file,
        coverPhoto: reader.result,
        photoSizeError: false,
        isLoading: false,
      });
    };

    reader.readAsDataURL(file);
  };

  save = e => {
    e.preventDefault();
    const {
      name,
      description,
      website,
      file,
      coverFile,
      communityId,
      photoSizeError,
    } = this.state;
    const input = {
      name,
      description,
      website,
      file,
      coverFile,
      communityId,
    };

    if (photoSizeError) {
      return;
    }

    this.setState({
      isLoading: true,
    });

    this.props
      .editCommunity(input)
      .then(({ data: { editCommunity } }) => {
        const community = editCommunity;

        this.setState({
          isLoading: false,
        });

        // community was returned
        if (community !== undefined) {
          track('community', 'edited', null);

          this.props.dispatch(
            addToastWithTimeout('success', 'Community saved!')
          );
          window.location.href = `/${this.props.community.slug}`;
        }
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });

        this.props.dispatch(
          addToastWithTimeout(
            'error',
            `Something went wrong and we weren’t able to save these changes. ${err}`
          )
        );
      });
  };

  cancelForm = e => {
    e.preventDefault();
    return (window.location.href = `/${this.props.community.slug}`);
  };

  triggerDeleteCommunity = (e, communityId) => {
    e.preventDefault();
    track('community', 'delete inited', null);
    const { name, communityData } = this.state;
    const message = (
      <div>
        <p>
          Are you sure you want to delete your community, <b>{name}</b>?
        </p>{' '}
        <p>
          <b>{communityData.metaData.members} members</b> will be removed from
          the community and the{' '}
          <b>{communityData.metaData.channels} channels</b> you’ve created will
          be deleted.
        </p>
        <p>
          All threads, messages, reactions, and media shared in your community
          will be deleted.
        </p>
        <p>This cannot be undone.</p>
      </div>
    );

    return this.props.dispatch(
      openModal('DELETE_DOUBLE_CHECK_MODAL', {
        id: communityId,
        entity: 'community',
        message,
      })
    );
  };

  render() {
    const {
      name,
      slug,
      description,
      image,
      coverPhoto,
      website,
      photoSizeError,
      nameError,
      isLoading,
    } = this.state;
    const { community } = this.props;

    if (!community) {
      return (
        <SectionCard>
          <FormTitle>This community doesn’t exist yet.</FormTitle>
          <Description>Want to make it?</Description>
          <Actions>
            <Button>Create</Button>
          </Actions>
        </SectionCard>
      );
    }

    return (
      <SectionCard>
        <SectionTitle>Community Settings</SectionTitle>
        <Form onSubmit={this.save}>
          <ImageInputWrapper>
            <CoverInput
              onChange={this.setCommunityCover}
              defaultValue={coverPhoto}
              preview={true}
              allowGif
            />

            <PhotoInput
              onChange={this.setCommunityPhoto}
              defaultValue={image}
              community
              user={null}
              allowGif
            />
          </ImageInputWrapper>

          <Input defaultValue={name} onChange={this.changeName}>
            Name
          </Input>
          <UnderlineInput defaultValue={slug} disabled>
            sp.chat/
          </UnderlineInput>

          {nameError && (
            <Error>Community names can be up to 20 characters long.</Error>
          )}

          <TextArea
            defaultValue={description}
            onChange={this.changeDescription}
          >
            Description
          </TextArea>

          <Input defaultValue={website} onChange={this.changeWebsite}>
            Optional: Add your community’s website
          </Input>

          <Actions>
            <Button
              loading={isLoading}
              onClick={this.save}
              disabled={photoSizeError}
              type="submit"
            >
              Save
            </Button>
            <TextButton hoverColor={'warn.alt'} onClick={this.cancelForm}>
              Cancel
            </TextButton>
            <TertiaryActionContainer>
              <IconButton
                glyph="delete"
                tipText={`Delete ${name}`}
                tipLocation="top-right"
                color="text.placeholder"
                hoverColor={'warn.alt'}
                onClick={e => this.triggerDeleteCommunity(e, community.id)}
              />
            </TertiaryActionContainer>
          </Actions>

          {photoSizeError && (
            <Notice style={{ marginTop: '16px' }}>
              Photo uploads should be less than 3mb
            </Notice>
          )}
        </Form>
      </SectionCard>
    );
  }
}

export default compose(
  connect(),
  deleteCommunityMutation,
  editCommunityMutation,
  withRouter
)(EditForm);
