//@flow
import React, { Component } from 'react';
// $FlowFixMe
import queryString from 'query-string';

class ThreadSlider extends Component {
  render() {
    const parsed = queryString.parse(this.props.location.search);
    if (!parsed.thread) return null;
    return (
      <div>
        thread {parsed.thread}
      </div>
    );
  }
}

export default ThreadSlider;
