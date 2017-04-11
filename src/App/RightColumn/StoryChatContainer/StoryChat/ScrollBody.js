//@flow
import React, { Component } from 'react';
//$FlowFixMe
import styled from 'styled-components';

export class ScrollBody extends Component {
  componentDidMount() {
    const { forceScrollToBottom } = this.props;
    // force scroll to bottom when thread loads if designated
    if (forceScrollToBottom) {
      this.forceScrollToBottom();
    }
  }

  componentDidUpdate(prevProps) {
    // contextual scroll to bottom when a new message is sent in the thread
    if (prevProps.active.last_activity !== this.props.active.last_activity) {
      return this.contextualScrollToBottom();
    } else if (
      prevProps.active.id !== this.props.active.id &&
      this.props.forceScrollToBottom
    ) {
      return this.forceScrollToBottom();
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
`;
