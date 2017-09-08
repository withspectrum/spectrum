import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Master, Detail } from './view';
import { View } from './style';

class Inbox extends Component {
  render() {
    const { currentUser, location } = this.props;
    return (
      <View>
        <Master location={location} user={currentUser} />
        <Detail location={location} user={currentUser} />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.users.currentUser,
});

export default connect(mapStateToProps)(Inbox);
