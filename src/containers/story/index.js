import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';
import styled from 'styled-components';

const StoryChat = ({ match }) => <div>{match.params.storyId}</div>;

const Container = styled.div`

`;

class Story extends Component {
  render() {
    const { match } = this.props;

    return (
      <Container>

        <div>user profile</div>
        <div>frequency profile</div>

        {/* render the story chat given the url param */}
        <Route path={`${match.url}/:storyId`} component={StoryChat} />

        {/*
          if a user lands directly on /story there will be nothing to load
          so redirect them back to home.
        */}
        <Route exact path={match.url} render={() => <Redirect to="/" />} />

      </Container>
    );
  }
}

export default Story;
