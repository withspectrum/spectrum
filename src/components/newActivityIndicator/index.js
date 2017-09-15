// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearActivityIndicator } from '../../actions/newActivityIndicator';
import styled from 'styled-components';
import { Gradient, Spinner } from '../globals';

const Pill = styled.div`
  padding: ${props => (props.refetching ? '8px' : '8px 16px')};
  border-radius: 20px;
  color: ${props => props.theme.text.reverse};
  background: ${props =>
    Gradient(props.theme.brand.alt, props.theme.brand.default)};};
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-self: center;
  position: fixed;
  top: 0;
  opacity: ${props => (props.active ? '1' : '0')};
  pointer-events: ${props => (props.active ? 'auto' : 'none')};
  left: 50%;
  z-index: 9999;
  transform: translateX(-50%) translateY(${props =>
    props.active ? '80px' : '60px'});
  font-weight: 700;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  transition: all 0.2s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: translateX(-50%) translateY(78px);
    transition: all 0.2s ease-in-out;
  }

  &:active {
    transform: translateX(-50%) translateY(80px);
    transition: all 0.1s ease-in-out;
  }

  @media (max-width: 768px) {
    transform: translateX(-50%) translateY(${props =>
      props.active ? '60px' : '40px'});

    &:hover {
      transform: translateX(-50%) translateY(58px);
      transition: all 0.2s ease-in-out;
    }

    &:active {
      transform: translateX(-50%) translateY(60px);
      transition: all 0.1s ease-in-out;
    }
  }
`;

const scrollTo = (element, to, duration) => {
  if (duration < 0) return;
  const difference = to - element.scrollTop;
  const perTick = difference / duration * 2;

  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick;
    scrollTo(element, to, duration - 2);
  }, 10);
};

class Indicator extends Component {
  state: {
    elem: any,
  };

  constructor() {
    super();

    this.state = {
      elem: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.setState({
        // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
        // the AppViewWrapper which is the scrolling part of the site.
        elem: document.getElementById('scroller-for-thread-feed'),
      });
    }
  }

  componentDidMount() {
    const elem = document.getElementById('scroller-for-thread-feed');
    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      elem,
    });

    // if the component mounted while the user is scrolled to the top, immediately clear the redux store of the activity indicator - since the user can see the top of the feed, they don't need an indicator
    if (elem.scrollTop < window.innerHeight / 2) {
      this.props.dispatch(clearActivityIndicator());
    }
  }

  componentWillUnmount() {
    // when the component unmounts, clear the state so that at next mount we will always get a new scrollTop position for the scroll element
    this.setState({
      elem: null,
    });
  }

  clearActivityIndicator = () => {
    // if the user clicks on the new activity indicator, scroll them to the top of the feed and dismiss the indicator
    setTimeout(() => this.props.dispatch(clearActivityIndicator()), 120);
    scrollTo(this.state.elem, 0, 80);
  };

  render() {
    const { elem } = this.state;
    let active = false;

    // if the scroll element exists, and the user has scrolled at least half of the screen (e.g. the top of the feed is out of view), then the user should see a new activity indicator
    if (elem) {
      active = elem.scrollTop > window.innerHeight / 2;
    }

    return (
      <Pill active={active} onClick={this.clearActivityIndicator}>
        New conversations!
      </Pill>
    );
  }
}

export default connect()(Indicator);
