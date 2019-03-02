// @flow
import * as React from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import type { History } from 'react-router';
import Icon from 'src/components/icons';
import { Placeholder, PlaceholderLabel } from '../style';
import type { Dispatch } from 'redux';
import getComposerLink from 'src/helpers/get-composer-link';

type Props = {
  dispatch: Dispatch<Object>,
  history: History,
  communityId: ?string,
  channelId: ?string,
};
class ComposerPlaceholder extends React.Component<Props> {
  render() {
    const { communityId, channelId } = this.props;
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
