//@flow
import React from 'react';
import { findDOMNode } from 'react-dom';
//$FlowFixMe
import { injectGlobal } from 'styled-components';

let hljs = false;
class Highlight extends React.Component {
  props: {
    continuously?: boolean,
  };

  componentDidMount() {
    this.init();
  }

  componentDidUpdate() {
    if (this.props.continuously !== false) {
      this.init();
    }
  }

  init = () => {
    if (hljs) return this.highlight();
    // Load highlight.js when it's necessary, but not before
    import('highlight.js').then(module => {
      hljs = module;
      this.highlight();
    });
  };

  highlight = () => {
    findDOMNode(this.node).querySelectorAll('pre code').forEach(block => {
      hljs.highlightBlock(block);
    });
  };

  render() {
    return (
      <div ref={node => (this.node = node)}>
        {this.props.children}
      </div>
    );
  }
}

export default Highlight;
