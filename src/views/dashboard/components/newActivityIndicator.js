import React, { Component } from 'react';
import { connect } from 'react-redux';
import { clearActivityIndicator } from '../../../actions/newActivityIndicator';
import styled from 'styled-components';

const NewActivityBar = styled.div`
  padding: ${props => (props.refetching ? '8px' : '8px 16px')};
  color: ${props => props.theme.brand.alt};
  background: ${props => props.theme.bg.wash};
  font-size: 14px;
  font-weight: 600;
  display: ${props => (props.active ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  align-self: center;
  padding: 12px 16px;
  height: 40px;
  border-top: 1px solid ${props => props.theme.bg.border};
  border-bottom: 1px solid ${props => props.theme.bg.border};
  z-index: 10;
  position: relative;
  cursor: pointer;
  width: 100%;
  text-align: center;
  line-height: 1;
  display: block;

  @media (max-width: 768px) {
    padding: 20px 16px;
    height: 56px;
  }

  &:hover {
    background: ${props => props.theme.brand.alt};
    color: ${props => props.theme.text.reverse};
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
        elem: document.getElementById(this.props.elem),
      });
    }
  }

  componentDidMount() {
    const elem = document.getElementById(this.props.elem);
    this.setState({
      // NOTE(@mxstbr): This is super un-reacty but it works. This refers to
      // the AppViewWrapper which is the scrolling part of the site.
      elem,
    });

    // if the component mounted while the user is scrolled to the top, immediately clear the redux store of the activity indicator - since the user can see the top of the feed, they don't need an indicator
    if (elem.scrollTop < window.innerHeight / 4) {
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
      <NewActivityBar active={active} onClick={this.clearActivityIndicator}>
        New conversations!
      </NewActivityBar>
    );
  }
}

export default connect()(Indicator);
