// @flow
import * as React from 'react';
import { withRouter } from 'react-router';
import slugg from 'slugg';
import { withApollo } from 'react-apollo';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import Link from 'src/components/link';
import { track } from '../../helpers/events';
import { throttle } from '../../helpers/utils';
import { Button } from '../buttons';
import Icon from '../../components/icons';
import { SERVER_URL, CLIENT_URL } from '../../api/constants';
import GithubProfile from '../../components/githubProfile';
import { GithubSigninButton } from '../../components/loginButtonSet/github';
import {
  Input,
  TextArea,
  Error,
  PhotoInput,
  CoverInput,
} from '../formElements';
import { StyledLabel } from '../formElements/style';
import {
  StyledCard,
  Form,
  FormTitle,
  Actions,
  ImageInputWrapper,
  Location,
  Loading,
  GithubSignin,
} from './style';
import { Spinner } from '../../components/globals';
import { getUserByUsernameQuery } from 'shared/graphql/queries/user/getUser';
import type { GetUserType } from 'shared/graphql/queries/user/getUser';
import editUserMutation from 'shared/graphql/mutations/user/editUser';
import type { EditUserType } from 'shared/graphql/mutations/user/editUser';
import { addToastWithTimeout } from '../../actions/toasts';
import {
  PRO_USER_MAX_IMAGE_SIZE_STRING,
  PRO_USER_MAX_IMAGE_SIZE_BYTES,
  FREE_USER_MAX_IMAGE_SIZE_BYTES,
  FREE_USER_MAX_IMAGE_SIZE_STRING,
} from '../../helpers/images';
import { Notice } from '../../components/listItems/style';

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
  isUsernameSearching: boolean,
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
      isUsernameSearching: false,
    };

    this.search = throttle(this.search, 500);
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
      track('user', 'profile photo uploaded', null);

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
      track('user', 'cover photo uploaded', null);

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

    track('user', 'edited', null);

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
          window.location.href = `/users/${user.username}`;
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

  changeUsername = e => {
    let username = e.target.value.trim();
    username = slugg(username);

    this.setState({
      usernameError: '',
      username,
    });

    if (username.length > 20) {
      return this.setState({
        usernameError: 'Usernames can be up to 20 characters',
      });
    } else if (username.length === 0) {
      this.setState({
        usernameError: 'Be sure to set a username so that people can find you!',
      });
    } else {
      this.setState({
        usernameError: '',
      });
    }

    // $FlowIssue
    this.search(username);
  };

  search = (username: string) => {
    if (username.length > 20) {
      return this.setState({
        usernameError: 'Usernames can be up to 20 characters',
        isUsernameSearching: false,
      });
    } else if (username.length === 0) {
      return this.setState({
        usernameError: 'Be sure to set a username so that people can find you!',
        isUsernameSearching: false,
      });
    } else {
      this.setState({
        usernameError: '',
        isUsernameSearching: true,
      });

      // check the db to see if this channel slug exists
      this.props.client
        .query({
          query: getUserByUsernameQuery,
          variables: {
            username,
          },
        })
        .then(({ data: { user } }: { data: { user: GetUserType } }) => {
          if (this.state.username.length > 20) {
            return this.setState({
              usernameError: 'Usernames can be up to 20 characters',
              isUsernameSearching: false,
            });
          } else if (user && user.id) {
            return this.setState({
              usernameError: 'This username is already taken, sorry!',
              isUsernameSearching: false,
            });
          } else {
            return this.setState({
              usernameError: '',
              isUsernameSearching: false,
            });
          }
        })
        .catch(err =>
          this.props.dispatch(addToastWithTimeout('error', err.message))
        );
    }
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
      isUsernameSearching,
    } = this.state;

    const postAuthRedirectPath = `?r=${CLIENT_URL}/users/${username}/settings`;

    return (
      <StyledCard>
        <Location>
          <Icon glyph="view-back" size={16} />
          <Link to={`/users/${username}`}>Return to Profile</Link>
        </Location>
        <FormTitle>Profile Settings</FormTitle>
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

          <Input
            type="text"
            defaultValue={name}
            onChange={this.changeName}
            placeholder={"What's your name?"}
          >
            Name
          </Input>

          {nameError && <Error>Names can be up to 50 characters.</Error>}

          <Input
            type={'text'}
            defaultValue={username}
            onChange={this.changeUsername}
          >
            Username
            {isUsernameSearching && (
              <Loading>
                <Spinner size={16} color={'brand.default'} />
              </Loading>
            )}
          </Input>

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
              disabled={!name || nameError || !username || usernameError}
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
      </StyledCard>
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
