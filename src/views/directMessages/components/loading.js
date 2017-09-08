// @flow
import React from 'react';
// $FlowFixMe
import branch from 'recompose/branch';
// $FlowFixMe
import renderComponent from 'recompose/renderComponent';
// $FlowFixMe
import { Link } from 'react-router-dom';

import Icon from '../../../components/icons';
import { LoadingDM } from '../../../components/loading';
import { View, MessagesList, ComposeHeader } from '../style';

const LoadingState = () => (
  <View>
    <MessagesList>
      <Link to="/messages/new">
        <ComposeHeader>
          <Icon glyph="message-new" />
        </ComposeHeader>
      </Link>
      <div>
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
        <LoadingDM />
      </div>
    </MessagesList>
  </View>
);

export const displayLoadingState = branch(
  props => !props.data || props.data.loading,
  renderComponent(LoadingState)
);
