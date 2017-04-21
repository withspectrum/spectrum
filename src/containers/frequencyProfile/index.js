import React, { Component } from 'react';
import styled from 'styled-components';

const Container = styled.div`

`;

class FrequencyProfile extends Component {
  render() {
    const { match } = this.props;

    return (
      <Container>
        <h3>{match.params.communityId} - {match.params.frequencyId}</h3>
      </Container>
    );
  }
}

export default FrequencyProfile;
