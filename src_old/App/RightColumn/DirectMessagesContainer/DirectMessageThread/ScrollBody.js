//@flow
import React, { Component } from 'react';
//$FlowFixMe
import styled from 'styled-components';

export class ScrollBody extends Component {
  componentDidMount() {
    this.forceScrollToBottom();
  }

  componentDidUpdate(prevProps) {
    // force scroll to bottom when thread is changed
    if (
      prevProps.active.id === this.props.active.id &&
      prevProps.active.last_activity !== this.props.active.last_activity
    ) {
      this.contextualScrollToBottom();
    }

    if (prevProps.active.id !== this.props.active.id) {
      this.forceUpdate();
    }
  }

  contextualScrollToBottom = () => {
    if (!this.scrollBody) return;
    let node = this.scrollBody;

    if (node.scrollHeight - node.clientHeight < node.scrollTop + 140) {
      node.scrollTop = node.scrollHeight - node.clientHeight;
    }
  };

  forceScrollToBottom = () => {
    if (!this.scrollBody) return;
    let node = this.scrollBody;
    node.scrollTop = node.scrollHeight - node.clientHeight;
  };

  render() {
    return (
      <StyledScrollBody innerRef={scrollBody => this.scrollBody = scrollBody}>
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
  overflow-x: hidden;
  max-width: 100%;
`;
