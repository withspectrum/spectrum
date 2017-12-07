import React, { Component } from 'react';
import { connect } from 'react-redux';
import ComposerPlaceholder from './components/placeholder';
import ComposerEditor from './components/composer';

class ThreadComposerWithData extends Component {
  render() {
    const {
      isOpen,
      isInbox,
      showComposerUpsell,
      activeCommunity,
      activeChannel,
    } = this.props;
    const showCommunityOwnerUpsell = showComposerUpsell || false;

    return isOpen ? (
      <ComposerEditor
        activeCommunity={activeCommunity}
        activeChannel={activeChannel}
      />
    ) : (
      <ComposerPlaceholder
        isInbox={isInbox}
        isOpen={isOpen}
        showCommunityOwnerUpsell={showCommunityOwnerUpsell}
      />
    );
  }
}

const map = state => ({ isOpen: state.composer.isOpen });
export default connect(map)(ThreadComposerWithData);
