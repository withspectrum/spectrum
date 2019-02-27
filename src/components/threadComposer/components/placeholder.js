// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { History } from 'react-router';
import { openComposer } from 'src/actions/composer';
import Icon from 'src/components/icons';
import { Container, Composer, Placeholder, PlaceholderLabel } from '../style';
import Upsell from './upsell';
import type { Dispatch } from 'redux';

type Props = {
  dispatch: Dispatch<Object>,
  isOpen: boolean,
  isInbox: boolean,
  showCommunityOwnerUpsell: boolean,
  history: History,
  communityId: ?string,
  channelId: ?string,
};
class ComposerPlaceholder extends React.Component<Props> {
  triggerOpenComposer = () => {
    const { dispatch, history, communityId, channelId } = this.props;
    history.push({
      search: `${communityId ? `?composerCommunityId=${communityId}` : ''}${
        channelId ? `&composerChannelId=${channelId}` : ''
      }`,
    });
    return dispatch(openComposer());
  };

  render() {
    const { isOpen, showCommunityOwnerUpsell, isInbox } = this.props;

    return (
      <Container
        isOpen={isOpen}
        isInbox={isInbox}
        data-cy="thread-composer-placeholder"
      >
        <Composer
          isOpen={isOpen}
          onClick={this.triggerOpenComposer}
          isInbox={isInbox}
        >
          {!isOpen && showCommunityOwnerUpsell && <Upsell />}
          <Placeholder isOpen={isOpen}>
            <Icon glyph="post" />
            <PlaceholderLabel>Start a new conversation...</PlaceholderLabel>
          </Placeholder>
        </Composer>
      </Container>
    );
  }
}
export default compose(
  withRouter,
  connect()
)(ComposerPlaceholder);
