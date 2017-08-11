// @flow
import React, { Component } from 'react';
//$FlowFixMe
import { withRouter } from 'react-router';
// $FlowFixMe
import slugg from 'slugg';
// $FlowFixMe
import { withApollo } from 'react-apollo';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import { connect } from 'react-redux';
// $FlowFixMe
import { Link } from 'react-router-dom';
import { track } from '../../../helpers/events';
import { throttle } from '../../../helpers/utils';
import { Button, TextButton } from '../../../components/buttons';
import Icon from '../../../components/icons';
import {
  Input,
  TextArea,
  Error,
  PhotoInput,
  CoverInput,
} from '../../../components/formElements';
import {
  StyledCard,
  Form,
  FormTitle,
  Actions,
  ImageInputWrapper,
  Location,
  Loading,
} from './style';
import { Spinner } from '../../../components/globals';
import {
  editUserMutation,
  CHECK_UNIQUE_USERNAME_QUERY,
} from '../../../api/user';
import { addToastWithTimeout } from '../../../actions/toasts';
import {
  PRO_USER_MAX_IMAGE_SIZE_STRING,
  PRO_USER_MAX_IMAGE_SIZE_BYTES,
  FREE_USER_MAX_IMAGE_SIZE_BYTES,
  FREE_USER_MAX_IMAGE_SIZE_STRING,
} from '../../../helpers/images';
import { Notice } from '../../../components/listItems/style';

class UserInfoPure extends Component {
  state: {
    website: string,
    name: string,
    username: string,
    description: string,
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
  };

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
      .then(({ data: { editUser } }) => {
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
      })
      .catch(err => {
        this.setState({
          isLoading: false,
        });

        this.props.dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
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
    } = this.state;

    return (
      <StyledCard>
        <Form onSubmit={this.save}>
          <ImageInputWrapper>
            <CoverInput
              onChange={this.setCoverPhoto}
              defaultValue={coverPhoto}
              preview={true}
            />
            <PhotoInput
              onChange={this.setProfilePhoto}
              defaultValue={image}
              user
            />
          </ImageInputWrapper>

          {photoSizeError &&
            <Notice style={{ marginTop: '32px' }}>
              {photoSizeError}
            </Notice>}

          {proGifError &&
            <Notice style={{ marginTop: '32px' }}>
              Upgrade to Pro to use a gif as your profile or cover photo{' '}
              <span role="img" aria-label="finger pointing right emoji">
                👉
              </span>
            </Notice>}

          <div style={{ display: 'flex' }}>
            <Input
              style={{ marginRight: '8px' }}
              type="text"
              defaultValue={name}
              onChange={this.changeName}
              placeholder={"What's your name?"}
              autoFocus
            >
              Name
            </Input>
            <Input
              style={{ marginLeft: '8px' }}
              defaultValue={website}
              onChange={this.changeWebsite}
            >
              Your website (optional)
            </Input>
          </div>

          {nameError && <Error>Names can be up to 50 characters.</Error>}

          <TextArea
            defaultValue={description}
            onChange={this.changeDescription}
            placeholder={'Introduce yourself to the class...'}
          >
            A few words about yourself
          </TextArea>

          {descriptionError &&
            <Error>
              Whoa there Homer, let's try and keep this brief - like, 140
              characters brief.
            </Error>}
        </Form>
      </StyledCard>
    );
  }
}

const map = state => ({
  currentUser: state.users.currentUser,
});

const UserInfo = compose(
  editUserMutation,
  withRouter,
  withApollo,
  connect(map),
  pure
)(UserInfoPure);
export default UserInfo;
