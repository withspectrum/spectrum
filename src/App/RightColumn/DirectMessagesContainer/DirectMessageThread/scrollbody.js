//@flow
import React, { Component } from 'react';
//$FlowFixMe
import styled from 'styled-components';

export class ScrollBody extends Component {
  render() {
    return (
      <StyledScrollBody>
        {this.props.children}
      </StyledScrollBody>
    );
  }
}

const StyledScrollBody = styled.div`
  display: flex;
  flex: 1 1 auto;
  max-height: 100%;
  flex-direction: column;
  overflow-y: scroll;
`;
