// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import { withApollo } from 'react-apollo';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { PrimaryOutlineButton } from 'src/components/button';
import Icon from 'src/components/icon';
import { SERVER_URL, CLIENT_URL } from 'src/api/constants';
import GithubProfile from 'src/components/githubProfile';
import { GithubSigninButton } from 'src/components/loginButtonSet/github';
import {
  Input,
  TextArea,
  Error,
  Success,
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
} from 'src/helpers/images';
import { Notice } from 'src/components/listItems/style';
import { SectionCard, SectionTitle } from 'src/components/settingsViews/style';
import type { Dispatch } from 'redux';
import type { GetCurrentUserSettingsType } from 'shared/graphql/queries/user/getCurrentUserSettings';
import isEmail from 'validator/lib/isEmail';

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
  usernameError: string,
  email: string,
  emailError: string,
  didChangeEmail: boolean,
};

type Props = {
  dispatch: Dispatch<Object>,
  client: Object,
  editUser: Function,
  user: GetCurrentUserSettingsType,
};

class UserWithData extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const user = this.props.user;

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
      usernameError: '',
      email: user.email ? user.email : '',
      emailError: '',
      didChangeEmail: false,
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

  changeEmail = e => {
    const email = e.target.value;

    if (!email || email.length === 0) {
      return this.setState({
        email,
        emailError: 'Your email can’t be blank',
        didChangeEmail: false,
      });
    }

    this.setState({
      email,
      emailError: '',
      didChangeEmail: false,
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

    if (!file) return;

    this.setState({
      isLoading: true,
    });

    if (file && file.size > PRO_USER_MAX_IMAGE_SIZE_BYTES) {
      return this.setState({
        photoSizeError: `Try uploading a file less than ${PRO_USER_MAX_IMAGE_SIZE_STRING}.`,
        isLoading: false,
      });
    }

    reader.onloadend = () => {
      this.setState({
        file: file,
        // $FlowFixMe
        image: reader.result,
        photoSizeError: '',
        isLoading: false,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  setCoverPhoto = e => {
    let reader = new FileReader();
    let file = e.target.files[0];

    if (!file) return;

    this.setState({
      isLoading: true,
    });

    if (file && file.size > PRO_USER_MAX_IMAGE_SIZE_BYTES) {
      return this.setState({
        photoSizeError: `Try uploading a file less than ${PRO_USER_MAX_IMAGE_SIZE_STRING}.`,
        isLoading: false,
      });
    }

    reader.onloadend = () => {
      this.setState({
        coverFile: file,
        // $FlowFixMe
        coverPhoto: reader.result,
        photoSizeError: '',
        isLoading: false,
      });
    };

    if (file) {
      reader.readAsDataURL(file);
    }
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
      email,
      emailError,
    } = this.state;

    const { user } = this.props;

    const input = {
      name,
      description,
      website,
      file,
      coverFile,
      username,
      email,
    };

    if (!isEmail(email)) {
      return this.setState({
        emailError: 'Please add a valid email address.',
      });
    }

    if (email !== user.email) {
      this.setState({
        didChangeEmail: true,
      });
    }

    if (photoSizeError || usernameError || emailError) {
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
    const { user } = this.props;
    // we want to reset error if was typed same username which was set before
    const usernameError = user.username === username ? '' : error;
    this.setState({
      usernameError,
      username,
    });
  };

  handleOnError = err => {
    this.props.dispatch(addToastWithTimeout('error', err.message));
  };

  render() {
    const { user } = this.props;
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
      usernameError,
      email,
      emailError,
      didChangeEmail,
    } = this.state;

    const postAuthRedirectPath = `${CLIENT_URL}/users/${username}/settings`;

    return (
      <SectionCard data-cy="user-edit-form">
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
            />
            <PhotoInput
              type={'user'}
              onChange={this.setProfilePhoto}
              defaultValue={image}
            />
          </ImageInputWrapper>

          {photoSizeError && (
            <Notice style={{ marginTop: '32px' }}>{photoSizeError}</Notice>
          )}

          <div style={{ height: '8px' }} />

          <Input
            type="text"
            defaultValue={name}
            onChange={this.changeName}
            placeholder={"What's your name?"}
            dataCy="user-name-input"
          >
            Name
          </Input>

          {nameError && <Error>Names can be up to 50 characters.</Error>}

          <UsernameSearch
            type={'text'}
            label="Username"
            size={'small'}
            username={username}
            placeholder="Set a username..."
            onValidationResult={this.handleUsernameValidation}
            onError={this.handleOnError}
            dataCy="user-username-input"
          />

          {usernameError && (
            <Notice style={{ marginTop: '16px' }}>{usernameError}</Notice>
          )}

          <TextArea
            defaultValue={description}
            onChange={this.changeDescription}
            placeholder={'Introduce yourself to the class...'}
            dataCy="user-description-input"
          >
            Bio
          </TextArea>

          {descriptionError && <Error>Bios can be up to 140 characters.</Error>}

          <Input
            defaultValue={website}
            onChange={this.changeWebsite}
            dataCy="user-website-input"
          >
            Optional: Add your website
          </Input>

          <Input
            type="text"
            defaultValue={email}
            onChange={this.changeEmail}
            placeholder={'Email address'}
            dataCy="user-email-input"
          >
            Email
          </Input>

          {didChangeEmail && (
            <Success>A confirmation email has been sent to {email}.</Success>
          )}
          {emailError && <Error>{emailError}</Error>}

          <GithubProfile
            id={user.id}
            render={profile => {
              if (!profile) {
                return (
                  <GithubSignin>
                    <StyledLabel>Connect your GitHub Profile</StyledLabel>
                    <GithubSigninButton
                      href={`${SERVER_URL}/auth/github?r=${postAuthRedirectPath}`}
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
                    <div>
                      Your GitHub Profile ·{' '}
                      <span>
                        <a
                          href={`${SERVER_URL}/auth/github?r=${postAuthRedirectPath}`}
                        >
                          Refresh username
                        </a>
                      </span>
                    </div>
                  </Input>
                );
              }
            }}
          />

          <Actions>
            <PrimaryOutlineButton
              disabled={
                !name ||
                nameError ||
                !username ||
                !!usernameError ||
                isLoading ||
                !!emailError
              }
              loading={isLoading}
              onClick={this.save}
              data-cy="save-button"
            >
              {isLoading ? 'Saving...' : 'Save'}
            </PrimaryOutlineButton>
          </Actions>

          {createError && (
            <Error>Please fix any errors above to save your profile.</Error>
          )}
        </Form>
      </SectionCard>
    );
  }
}

const UserSettings = compose(
  editUserMutation,
  withRouter,
  withApollo,
  connect()
)(UserWithData);
export default UserSettings;
