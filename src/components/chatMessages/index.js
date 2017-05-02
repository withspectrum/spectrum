// @flow
import React from 'react';
// $FlowFixMe
import { connect } from 'react-redux';

/*
  ChatMessages expects to receive sorted and grouped messages.
  They will arrive as an array of arrays, where each top-level array is a group
  of message bubbles.

  This means we will need a nested map in order to get each group, and then within
  each group render each bubble.
*/
const ChatMessages = ({ messages, currentUser }) => {
  return <div>foo</div>;
};

// get the current user from the store for evaulation of message bubbles
const mapStateToProps = state => ({ currentUser: state.users.currentUser });
export default connect(mapStateToProps)(ChatMessages);
