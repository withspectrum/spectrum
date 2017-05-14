// @flow
import React, { Component } from 'react';
// $FlowFixMe
import compose from 'recompose/compose';
// $FlowFixMe
import pure from 'recompose/pure';
import { Route } from 'react-router';
import styled from 'styled-components';
import { getCurrentUserDirectMessageGroups } from './queries';
import { displayLoadingScreen } from '../../components/loading';

const DirectMessagesChat = ({ match }) => <div>{match.params.threadId}</div>;

const Container = styled.div`

`;

class DirectMessages extends Component {
  render() {
    const { match, data: { directMessages } } = this.props;
    console.log(directMessages);
    return (
      <Container>

        {/* render the story chat given the url param */}
        <Route path={`${match.url}/:threadId`} component={DirectMessagesChat} />

      </Container>
    );
  }
}

export default compose(
  getCurrentUserDirectMessageGroups,
  displayLoadingScreen,
  pure
)(DirectMessages);
