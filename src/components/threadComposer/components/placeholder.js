// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { History } from 'react-router';
import Icon from 'src/components/icons';
import { Container, Composer, Placeholder, PlaceholderLabel } from '../style';
import Upsell from './upsell';
import type { Dispatch } from 'redux';
import getComposerLink from 'src/helpers/get-composer-link';

type Props = {
  dispatch: Dispatch<Object>,
  isInbox: boolean,
  showCommunityOwnerUpsell: boolean,
  history: History,
  communityId: ?string,
  channelId: ?string,
};
class ComposerPlaceholder extends React.Component<Props> {
  render() {
    const {
      showCommunityOwnerUpsell,
      isInbox,
      communityId,
      channelId,
    } = this.props;
    const { pathname, search } = getComposerLink({ communityId, channelId });
    return (
      <Placeholder
        data-cy="thread-composer-placeholder"
        to={{
          pathname,
          search,
          state: { modal: true },
        }}
      >
        <Icon glyph="post" />
        <PlaceholderLabel>Start a new conversation...</PlaceholderLabel>
      </Placeholder>
    );
  }
}
export default compose(
  withRouter,
  connect()
)(ComposerPlaceholder);
