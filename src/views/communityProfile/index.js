import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`

`;

class CommunityProfile extends Component {
  render() {
    const { match } = this.props;

    return (
      <Container>
        <h3>{match.params.communityId}</h3>
      </Container>
    );
  }
}

export default CommunityProfile;
