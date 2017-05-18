// @flow
import React, { Component } from 'react';
import Card from '../card';
//$FlowFixMe
import compose from 'recompose/compose';
//$FlowFixMe
import pure from 'recompose/pure';
//$FlowFixMe
import renderComponent from 'recompose/renderComponent';
//$FlowFixMe
import branch from 'recompose/branch';
import { LoadingCard } from '../loading';
import { Input, UnderlineInput, TextArea } from '../formElements';
import {
  StyledCard,
  Form,
  FormTitle,
  Description,
  Actions,
  ImgPreview,
} from './style';

const displayLoadingState = branch(
  props => props.data.loading,
  renderComponent(LoadingCard)
);

class UserWithData extends Component {
  render() {
    return <StyledCard />;
  }
}

const UserSettings = compose(displayLoadingState, pure)(UserWithData);
export default UserSettings;
