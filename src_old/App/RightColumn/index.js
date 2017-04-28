import React, { Component } from 'react';
import { connect } from 'react-redux';
import DirectMessagesContainer from './DirectMessagesContainer';
import StoryChatContainer from './StoryChatContainer';
import Explore from './Explore';

import {
  ViewContainer,
  NullContainer,
  Footer,
  BackArrow,
  LoginWrapper,
  Name,
  SubText,
  Heading,
  Spacer,
} from './style';

class RightColumn extends Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    // only update the right column if the top level navigation changes
    if (nextProps.activeCommunity !== this.props.activeCommunity) {
      return true;
    }
  };

  render() {
    const { activeCommunity } = this.props;

    if (activeCommunity === 'messages') {
      return <DirectMessagesContainer />;
    } else if (activeCommunity === 'explore') {
      return <Explore />;
    } else {
      return <StoryChatContainer />;
    }
  }
}

const mapStateToProps = state => ({
  activeCommunity: state.communities.active,
});

export default connect(mapStateToProps)(RightColumn);
