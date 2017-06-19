// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
// $FlowFixMe
import { Link } from 'react-router-dom';
// $FlowFixMe
import { connect } from 'react-redux';
import Icon from '../../components/icons';
import { displayLoadingState } from '../../components/loading';
import { View, MessagesList, ComposeHeader } from './style';
import NewThread from './containers/newThread';

class DirectMessages extends Component {
  render() {
    return (
      <View>
        <MessagesList>
          <Link to="/messages/new">
            <ComposeHeader>
              <Icon glyph="message-new" />
            </ComposeHeader>
          </Link>
        </MessagesList>

        <NewThread />
      </View>
    );
  }
}

const DirectMessagesWithQuery = compose(displayLoadingState, pure)(
  DirectMessages
);

export default connect()(DirectMessagesWithQuery);
