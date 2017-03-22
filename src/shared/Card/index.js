import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import deepEqual from 'deep-eql';
// eslint-disable-next-line
import { Wrapper, LinkWrapper } from './style';

class Card extends Component {
  shouldComponentUpdate(nextProps) {
    return !deepEqual(nextProps, this.props);
  }

  render() {
    const { link, selected, overflow, still } = this.props;
    // If there's a link, render a Link, otherwise render a div
    const Anchor = link ? Link : ({ children }) => <div>{children}</div>;
    return (
      <Wrapper overflow={overflow} still={still}>
        <Anchor to={link}>
          <LinkWrapper selected={selected}>
            {this.props.children}
          </LinkWrapper>
        </Anchor>
      </Wrapper>
    );
  }
}

export default Card;
