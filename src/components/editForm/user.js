// @flow
import React, { Component } from 'react';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import { connect } from 'react-redux';
import { Button, TextButton } from '../buttons';
import {
  Input,
  TextArea,
  Error,
  PhotoInput,
  CoverInput,
} from '../formElements';
import {
  StyledCard,
  Form,
  FormTitle,
  Actions,
  ImageInputWrapper,
} from './style';
import { editUserMutation } from '../../api/user';
import { addToastWithTimeout } from '../../actions/toasts';

class UserWithData extends Component {
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
    loading: boolean,
  };

  constructor(props) {
    super(props);

    const { user: { user } } = this.props;

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
      loading: false,
    };
  }

  changeName = e => {
    const name = e.target.value;
    this.setState({
      name,
      nameError: false,
    });
  };

  // changeUsername = e => {
  //   let username = e.target.value;
  //   username = username.toLowerCase().trim();
  //
  //   if (username.length >= 24) {
  //     this.setState({
  //       username,
  //       usernameError: true,
  //     });
  //
  //     return;
  //   }
  //
  //   if (username.length === 0) {
  //     this.setState({
  //       usernameError: true,
  //     })
  //   }
  //
  //   this.setState({
  //     username,
  //     usernameError: false,
  //     usernameTaken: false,
  //   });
  //
  //   this.checkUsername(username)
  // };
  //
  // checkUsername = username => {
  //   // check the db to see if this channel slug exists
  //   this.props.client
  //     .query({
  //       query: CHECK_UNIQUE_USERNAME_QUERY,
  //       variables: {
  //         username,
  //       },
  //     })
  //     .then(({ data }) => {
  //       // if a user exists with this username
  //       if (!data.loading && data && data.user && data.user.username) {
  //         return this.setState({
  //           usernameTaken: true,
  //         });
  //       } else {
  //         return this.setState({
  //           usernameTaken: false,
  //         });
  //       }
  //     });
  // };

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

    reader.onloadend = () => {
      this.setState({
        file: file,
        image: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  setCoverPhoto = e => {
    let reader = new FileReader();
    let file = e.target.files[0];

    reader.onloadend = () => {
      this.setState({
        coverFile: file,
        coverPhoto: reader.result,
      });
    };

    reader.readAsDataURL(file);
  };

  save = e => {
    e.preventDefault();
    const { name, description, website, file, coverFile } = this.state;

    const input = {
      name,
      description,
      website,
      file,
      coverFile,
    };

    this.props
      .editUser(input)
      .then(({ data: { editUser } }) => {
        const user = editUser;
        // the mutation returns a user object. if it exists,
        if (user !== undefined) {
          this.props.dispatch(addToastWithTimeout('success', 'Changes saved!'));
          this.setState({
            file: null,
          });
        }
      })
      .catch(err => {
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
      loading,
    } = this.state;

    return (
      <StyledCard>
        <FormTitle>Profile Settings</FormTitle>
        <Form>
          <ImageInputWrapper>
            <CoverInput
              onChange={this.setCoverPhoto}
              defaultValue={coverPhoto}
            />
            <PhotoInput onChange={this.setProfilePhoto} defaultValue={image} />
          </ImageInputWrapper>

          <Input
            type="text"
            defaultValue={name}
            onChange={this.changeName}
            placeholder={"What's your name?"}
          >
            Name
          </Input>

          <Input type={'text'} defaultValue={username} disabled={true}>
            Username - can't be changed, sorry!
          </Input>

          <TextArea
            defaultValue={description}
            onChange={this.changeDescription}
            placeholder={'Introduce yourself to the class...'}
          >
            Bio
          </TextArea>

          {descriptionError &&
            <Error>
              Bios can be up to 140 characters.
            </Error>}

          <Input defaultValue={website} onChange={this.changeWebsite}>
            Optional: Add your website
          </Input>

          <Actions>
            <TextButton hoverColor={'warn.alt'}>Cancel</TextButton>
            <Button
              disabled={!name || !description}
              loading={loading}
              onClick={this.save}
            >
              Save
            </Button>
          </Actions>

          {createError &&
            <Error>
              Please fix any errors above to save your profile.
            </Error>}
        </Form>
      </StyledCard>
    );
  }
}

const UserSettings = compose(editUserMutation, connect(), pure)(UserWithData);
export default UserSettings;
