import React, { Component } from 'react';
import { Route, Redirect } from 'react-router';
import styled from 'styled-components';

const UserProfileContainer = ({ match }) => <div>{match.params.userId}</div>;

const Container = styled.div`

`;

class UserProfile extends Component {
  render() {
    const { match } = this.props;

    return (
      <Container>

        {/* render the story chat given the url param */}
        <Route path={`${match.url}/:userId`} component={UserProfileContainer} />

        {/*
          if a user lands directly on /story there will be nothing to load
          so redirect them back to home.
        */}
        <Route exact path={match.url} render={() => <Redirect to="/" />} />

      </Container>
    );
  }
}

export default UserProfile;
