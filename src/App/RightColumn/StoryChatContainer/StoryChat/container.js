//@flow
import React, { Component } from 'react';
//$FlowFixMe
import styled from 'styled-components';

export class Container extends Component {
  render() {
    return (
      <StyledContainer>
        {this.props.children}
      </StyledContainer>
    );
  }
}

const StyledContainer = styled.div`
  display: flex;
  flex: 1 0 auto;
  flex-direction: column;
  overflow-y: hidden;
`;
