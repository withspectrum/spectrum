// @flow
import * as React from 'react';

type Props = {
  children: React.Node,
  style?: Object,
  onOutsideClick: Function,
};

class OutsideAlerter extends React.Component<Props> {
  wrapperRef: React.Node;

  componentDidMount() {
    // $FlowFixMe
    document.addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    // $FlowFixMe
    document.removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef = (node: React.Node) => {
    this.wrapperRef = node;
  };

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside = (event: any) => {
    // $FlowFixMe
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.props.onOutsideClick();
    }
  };

  render() {
    const { style = {} } = this.props;
    // $FlowFixMe
    return (
      <div style={style} ref={this.setWrapperRef}>
        {this.props.children}
      </div>
    );
  }
}

export default OutsideAlerter;
