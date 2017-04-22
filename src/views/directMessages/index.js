import React, { Component } from 'react';
import { Route } from 'react-router';
import styled from 'styled-components';

const DirectMessagesChat = ({ match }) => <div>{match.params.threadId}</div>;

const Container = styled.div`

`;

class DirectMessages extends Component {
  render() {
    const { match } = this.props;

    return (
      <Container>

        {/* render the story chat given the url param */}
        <Route path={`${match.url}/:threadId`} component={DirectMessagesChat} />

      </Container>
    );
  }
}

export default DirectMessages;
