// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import { withApollo } from 'react-apollo';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Link from 'src/components/link';
import { Button } from 'src/components/buttons';
import Icon from 'src/components/icons';
import { SERVER_URL, CLIENT_URL } from 'src/api/constants';
import GithubProfile from 'src/components/githubProfile';
import { GithubSigninButton } from 'src/components/loginButtonSet/github';
import {
  Input,
  TextArea,
  Error,
  PhotoInput,
  CoverInput,
} from 'src/components/formElements';
import UsernameSearch from 'src/components/usernameSearch';
import { StyledLabel } from 'src/components/formElements/style';
import {
  Form,
  Actions,
  ImageInputWrapper,
  Location,
  GithubSignin,
} from '../style';
import editUserMutation from 'shared/graphql/mutations/user/editUser';
import type { EditUserType } from 'shared/graphql/mutations/user/editUser';
import { addToastWithTimeout } from 'src/actions/toasts';
import {
  PRO_USER_MAX_IMAGE_SIZE_STRING,
  PRO_USER_MAX_IMAGE_SIZE_BYTES,
  FREE_USER_MAX_IMAGE_SIZE_BYTES,
  FREE_USER_MAX_IMAGE_SIZE_STRING,
} from 'src/helpers/images';
import { Notice } from 'src/components/listItems/style';
import { SectionCard, SectionTitle } from 'src/components/settingsViews/style';

type State = {
  website: ?string,
  name: string,
  username: string,
  description: ?string,
  image: string,
  coverPhoto: string,
  file: ?Object,
  coverFile: ?Object,
  descriptionError: boolean,
  nameError: boolean,
  createError: boolean,
  isLoading: boolean,
  photoSizeError: string,
  proGifError: boolean,
  usernameError: string,
};

type Props = {
  currentUser: Object,
  dispatch: Function,
  client: Object,
  editUser: Function,
};

class UserWithData extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const user = this.props.currentUser;

    this.state = {
      website: user.website ? user.website : '',
      name: user.name ? user.name : '',
      username: user.username ? user.username : '',
      description: user.description ? user.description : '',
      image: user.profilePhoto,
      coverPhoto: user.coverPhoto,
      file: null,
      coverFile: null,
      descriptionError: false,
      nameError: false,
      createError: false,
      isLoading: false,
      photoSizeError: '',
      proGifError: false,
      usernameError: '',
    };
  }

  changeName = e => {
    const name = e.target.value;
    if (name.length > 50) {
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

  setProfilePhoto = e => {
    let reader = new FileReader();
    let file = e.target.files[0];

    this.setState({
      isLoading: true,
    });

    if (!file) return;

    if (
      file &&
      file.size > FREE_USER_MAX_IMAGE_SIZE_BYTES &&
      !this.props.currentUser.isPro
    ) {
      return this.setState({
        photoSizeError: `Upgrade to Pro to upload files up to ${PRO_USER_MAX_IMAGE_SIZE_STRING}. Otherwise, try uploading a photo less than ${FREE_USER_MAX_IMAGE_SIZE_STRING}.`,
        isLoading: false,
      });
    }

    if (
      file &&
      file.size > PRO_USER_MAX_IMAGE_SIZE_BYTES &&
      this.props.currentUser.isPro
    ) {
      return this.setState({
        photoSizeError: `Try uploading a file less than ${PRO_USER_MAX_IMAGE_SIZE_STRING}.`,
        isLoading: false,
      });
    }

    if (file && file.type === 'image/gif' && !this.props.currentUser.isPro) {
      return this.setState({
        isLoading: false,
        proGifError: true,
      });
    }

    reader.onloadend = () => {
      this.setState({
        file: file,
        // $FlowFixMe
        image: reader.result,
        photoSizeError: '',
        proGifError: false,
        isLoading: false,
      });
    };

    reader.readAsDataURL(file);
  };

  setCoverPhoto = e => {
    let reader = new FileReader();
    let file = e.target.files[0];

    if (!file) return;

    this.setState({
      isLoading: true,
    });

    if (
      file &&
      file.size > FREE_USER_MAX_IMAGE_SIZE_BYTES &&
      !this.props.currentUser.isPro
    ) {
      return this.setState({
        photoSizeError: `Upgrade to Pro to upload files up to ${PRO_USER_MAX_IMAGE_SIZE_STRING}. Otherwise, try uploading a photo less than ${FREE_USER_MAX_IMAGE_SIZE_STRING}.`,
        isLoading: false,
      });
    }

    if (
      file &&
      file.size > PRO_USER_MAX_IMAGE_SIZE_BYTES &&
      this.props.currentUser.isPro
    ) {
      return this.setState({
        photoSizeError: `Try uploading a file less than ${PRO_USER_MAX_IMAGE_SIZE_STRING}.`,
        isLoading: false,
      });
    }

    if (file && file.type === 'image/gif' && !this.props.currentUser.isPro) {
      return this.setState({
        isLoading: false,
        proGifError: true,
      });
    }

    reader.onloadend = () => {
      this.setState({
        coverFile: file,
        // $FlowFixMe
        coverPhoto: reader.result,
        photoSizeError: '',
        proGifError: false,
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
      photoSizeError,
      username,
      usernameError,
    } = this.state;

    const input = {
      name,
      description,
      website,
      file,
      coverFile,
      username,
    };

    if (photoSizeError || usernameError) {
      return;
    }

    this.setState({
      isLoading: true,
    });

    this.props
      .editUser(input)
      .then(({ data: { editUser } }: { data: { editUser: EditUserType } }) => {
        const user = editUser;

        this.setState({
          isLoading: false,
        });

        // the mutation returns a user object. if it exists,
        if (user !== undefined) {
          this.props.dispatch(addToastWithTimeout('success', 'Changes saved!'));
          this.setState({
            file: null,
          });
        }

        return;
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });

        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  handleUsernameValidation = ({ error, username }) => {
    const { currentUser } = this.props;
    // we want to reset error if was typed same username which was set before
    const usernameError = currentUser.username === username ? '' : error;
    this.setState({
      usernameError,
      username,
    });
  };

  handleOnError = err => {
    this.props.dispatch(addToastWithTimeout('error', err.message));
  };

  render() {
    const { currentUser } = this.props;
    const {
      name,
      username,
      description,
      website,
      image,
      coverPhoto,
      descriptionError,
      createError,
      nameError,
      isLoading,
      photoSizeError,
      proGifError,
      usernameError,
    } = this.state;

    const postAuthRedirectPath = `?r=${CLIENT_URL}/users/${username}/settings`;

    return (
      <SectionCard>
        <Location>
          <Icon glyph="view-back" size={16} />
          <Link to={`/users/${username}`}>Return to Profile</Link>
        </Location>
        <SectionTitle>Profile Settings</SectionTitle>
        <Form onSubmit={this.save}>
          <ImageInputWrapper>
            <CoverInput
              onChange={this.setCoverPhoto}
              defaultValue={coverPhoto}
              preview={true}
              allowGif
            />
            <PhotoInput
              onChange={this.setProfilePhoto}
              defaultValue={image}
              user
              allowGif
            />
          </ImageInputWrapper>

          {photoSizeError && (
            <Notice style={{ marginTop: '32px' }}>{photoSizeError}</Notice>
          )}

          {proGifError && (
            <Notice style={{ marginTop: '32px' }}>
              Upgrade to Pro to use a gif as your profile or cover photo{' '}
              <span role="img" aria-label="finger pointing right emoji">
                👉
              </span>
            </Notice>
          )}

          <div style={{ height: '8px' }} />

          <Input
            type="text"
            defaultValue={name}
            onChange={this.changeName}
            placeholder={"What's your name?"}
          >
            Name
          </Input>

          {nameError && <Error>Names can be up to 50 characters.</Error>}

          <UsernameSearch
            type={'text'}
            label="Username"
            size={'small'}
            username={username}
            onValidationResult={this.handleUsernameValidation}
            onError={this.handleOnError}
          />

          {usernameError && (
            <Notice style={{ marginTop: '16px' }}>{usernameError}</Notice>
          )}

          <TextArea
            defaultValue={description}
            onChange={this.changeDescription}
            placeholder={'Introduce yourself to the class...'}
          >
            Bio
          </TextArea>

          {descriptionError && <Error>Bios can be up to 140 characters.</Error>}

          <Input defaultValue={website} onChange={this.changeWebsite}>
            Optional: Add your website
          </Input>

          <GithubProfile
            id={currentUser.id}
            render={profile => {
              if (!profile) {
                return (
                  <GithubSignin>
                    <StyledLabel>Connect your GitHub Profile</StyledLabel>
                    <GithubSigninButton
                      href={`${SERVER_URL}/auth/github${postAuthRedirectPath}`}
                      preferred={true}
                      showAfter={false}
                      onClickHandler={null}
                      verb={'Connect'}
                    />
                  </GithubSignin>
                );
              } else {
                return (
                  <Input
                    disabled
                    defaultValue={`github.com/${profile.username}`}
                  >
                    Your GitHub Profile
                  </Input>
                );
              }
            }}
          />

          <Actions>
            <Button
              disabled={
                !name || nameError || !username || usernameError || isLoading
              }
              loading={isLoading}
              onClick={this.save}
            >
              Save
            </Button>
          </Actions>

          {createError && (
            <Error>Please fix any errors above to save your profile.</Error>
          )}
        </Form>
      </SectionCard>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
});

const UserSettings = compose(
  editUserMutation,
  withRouter,
  withApollo,
  // $FlowIssue
  connect(map)
)(UserWithData);
export default UserSettings;
