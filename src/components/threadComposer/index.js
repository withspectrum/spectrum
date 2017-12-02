import React, { Component } from 'react';
import compose from 'recompose/compose';
import Textarea from 'react-textarea-autosize';
import { withRouter } from 'react-router';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import { track } from '../../helpers/events';
import { openComposer, closeComposer } from '../../actions/composer';
import { changeActiveThread } from '../../actions/dashboardFeed';
import { addToastWithTimeout } from '../../actions/toasts';
import Editor from '../draftjs-editor';
import { toPlainText, fromPlainText, toJSON } from 'shared/draft-utils';
import { getComposerCommunitiesAndChannels } from './queries';
import { publishThread } from './mutations';
import { getLinkPreviewFromUrl } from '../../helpers/utils';
import isURL from 'validator/lib/isURL';
import { URLS, ENDS_IN_WHITESPACE } from '../../helpers/regexps';
import { TextButton, Button } from '../buttons';
import { FlexRow } from '../../components/globals';
import Icon from '../icons';
import { LoadingComposer } from '../loading';
import { NullCard } from '../upsell';
import viewNetworkHandler from '../viewNetworkHandler';
import {
  Container,
  Composer,
  Overlay,
  Placeholder,
  PlaceholderLabel,
  ThreadDescription,
  ThreadTitle,
  ContentContainer,
  Actions,
  Dropdowns,
  ComposerUpsell,
  UpsellPulse,
  UpsellDot,
} from './style';
import ComposerPlaceholder from './components/placeholder';
import ComposerEditor from './components/composer';

class ThreadComposerWithData extends Component {
  render() {
    const {
      isOpen,
      isLoading,
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
