// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import Textarea from 'react-textarea-autosize';
import { withRouter } from 'react-router';
import Link from 'src/components/link';
import { connect } from 'react-redux';
import { track } from '../../../helpers/events';
import { openComposer, closeComposer } from '../../../actions/composer';
import { changeActiveThread } from '../../../actions/dashboardFeed';
import { addToastWithTimeout } from '../../../actions/toasts';
import Editor from '../../draftjs-editor';
import { toPlainText, fromPlainText, toJSON } from 'shared/draft-utils';
import { getComposerCommunitiesAndChannels } from '../queries';
import { publishThread } from '../mutations';
import { getLinkPreviewFromUrl } from '../../../helpers/utils';
import isURL from 'validator/lib/isURL';
import { URLS } from '../../../helpers/regexps';
import { TextButton, Button } from '../../buttons';
import { FlexRow } from '../../../components/globals';
import Icon from '../../icons';
import { LoadingComposer } from '../../loading';
import { NullCard } from '../../upsell';
import viewNetworkHandler from '../../viewNetworkHandler';
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
} from '../style';
import Upsell from './upsell';

type Props = {
  dispatch: Function,
  isOpen: boolean,
  isInbox: boolean,
  showCommunityOwnerUpsell: boolean,
};
class ComposerPlaceholder extends React.Component<Props> {
  render() {
    const { isOpen, showCommunityOwnerUpsell, isInbox, dispatch } = this.props;

    return (
      <Container isOpen={isOpen} isInbox={isInbox}>
        <Composer
          isOpen={isOpen}
          onClick={() => dispatch(openComposer())}
          isInbox={isInbox}
        >
          {!isOpen && showCommunityOwnerUpsell && <Upsell />}
          <Placeholder isOpen={isOpen}>
            <Icon glyph="post" onboarding="foo" tipLocation="top" />
            <PlaceholderLabel>Start a new conversation...</PlaceholderLabel>
          </Placeholder>
        </Composer>
      </Container>
    );
  }
}
export default connect()(ComposerPlaceholder);
