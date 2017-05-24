// @flow
import React, { Component } from 'react';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
//$FlowFixMe
import branch from 'recompose/branch';
import { Button, TextButton } from '../buttons';
import { LoadingCard } from '../loading';
import { Input } from '../formElements';
import {
  StyledCard,
  Form,
  FormTitle,
  Description,
  Actions,
  ImgPreview,
} from './style';

class UserWithData extends Component {
  render() {
    return (
      <StyledCard>
        {console.log(this.props)}
        <FormTitle>Profile Settings</FormTitle>
        <Form>
          <Input
            inputType="file"
            accept=".png, .jpg, .jpeg, .gif"
            multiple={false}
          >
            Add a logo or photo
          </Input>

          <Input type={'text'} placeholder={"What's your name?"}>
            Name
          </Input>
          <Input type={'text'} placeholder={'Pick a cool username...'}>
            Username
          </Input>

          <Actions>
            <TextButton hoverColor={'warn.alt'}>Cancel</TextButton>
            <Button onClick={this.save}>Save</Button>
          </Actions>
        </Form>
      </StyledCard>
    );
  }
}

const UserSettings = compose(pure)(UserWithData);
export default UserSettings;
