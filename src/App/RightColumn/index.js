import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { subscribeFrequency } from '../../actions/frequencies';
import { isStoryCreator, getStoryPermission } from '../../helpers/stories';
import { getCurrentFrequency } from '../../helpers/frequencies';
import { login } from '../../actions/user';
import history from '../../helpers/history';
import Icon from '../../shared/Icons';
import { Button, H4 } from '../../shared/Globals';
import DirectMessagesContainer from './DirectMessagesContainer';
import StoryChatContainer from './StoryChatContainer';
import Chat from './Chat';
import ChatInput from './ChatInput';
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

  // // if the user is at the bottom of the chat view and another user sends a message, scroll the view
  // contextualScrollToBottom = () => {
  //   if (!this.comp) return;
  //   let node = this.comp;
  //   if (node.scrollHeight - node.clientHeight < node.scrollTop + 140) {
  //     node.scrollTop = node.scrollHeight - node.clientHeight;
  //   }
  // };

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
