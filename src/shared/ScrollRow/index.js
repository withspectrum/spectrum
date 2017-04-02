import React, { Component } from 'react';
import { FlexRow } from '../Globals';

class ScrollRow extends Component {
  state = {
    scrollPos: null,
  };

  componentDidMount = () => {
    const node = this.hscroll;
    node.scrollLeft = this.state.scrollPos;
    console.log(node);

    let x, left, down;
    node.addEventListener('mousemove', e => {
      console.log('mousemove');
      if (down) {
        let newX = e.pageX;
        console.log(newX, left, x);
        node.scrollLeft = left - newX + x;
      }
    });

    node.addEventListener('mousedown', e => {
      console.log('mousedown');
      e.preventDefault();

      down = true;
      x = e.pageX;
      left = node.scrollLeft;
    });

    node.addEventListener('mouseup', e => {
      down = false;
    });

    node.addEventListener('mouseleave', e => {
      down = false;
    });
  };

  render() {
    return (
      <FlexRow innerRef={comp => this.hscroll = comp}>
        {this.props.children}
      </FlexRow>
    );
  }
}

export default ScrollRow;
