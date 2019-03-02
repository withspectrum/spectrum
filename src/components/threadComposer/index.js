import React, { Component } from 'react';
import { connect } from 'react-redux';
import ComposerEditor from './components/composer';

class ThreadComposerWithData extends Component {
  render() {
    const {
      isInbox,
      showComposerUpsell,
      activeCommunity,
      activeChannel,
    } = this.props;
    const showCommunityOwnerUpsell = showComposerUpsell || false;

    return i(
      <ComposerEditor
        activeCommunity={activeCommunity}
        activeChannel={activeChannel}
      />
    );
  }
}

export default connect()(ThreadComposerWithData);
