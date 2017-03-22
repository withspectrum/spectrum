import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// eslint-disable-next-line
import { Wrapper, LinkWrapper } from './style';

class Card extends Component {
  render() {
    const { link, selected } = this.props;
    return (
      <Wrapper>
        <Link to={link}>
          <LinkWrapper selected={selected}>
            {this.props.children}
          </LinkWrapper>
        </Link>
      </Wrapper>
    );
  }
}

export default Card;
