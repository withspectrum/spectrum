// @flow
import * as React from 'react';

type Props = {
  children: React$Node,
  style?: Object,
  onOutsideClick: Function,
};

class OutsideAlerter extends React.Component<Props> {
  wrapperRef: React$Node;

  // iOS bug, see: https://stackoverflow.com/questions/10165141/jquery-on-and-delegate-doesnt-work-on-ipad
  componentDidMount() {
    // $FlowFixMe
    document
      .getElementById('root')
      .addEventListener('mousedown', this.handleClickOutside);
  }

  componentWillUnmount() {
    // $FlowFixMe
    document
      .getElementById('root')
      .removeEventListener('mousedown', this.handleClickOutside);
  }

  setWrapperRef = (node: React$Node) => {
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
    const { style = {}, children } = this.props;
    return (
      // $FlowFixMe
      <div style={style} ref={this.setWrapperRef}>
        {children}
      </div>
    );
  }
}

export default OutsideAlerter;
