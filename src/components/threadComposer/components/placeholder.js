// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { openComposer } from '../../../actions/composer';
import Icon from '../../icons';
import { Container, Composer, Placeholder, PlaceholderLabel } from '../style';
import Upsell from './upsell';
import type { Dispatch } from 'redux';

type Props = {
  dispatch: Dispatch<Object>,
  isOpen: boolean,
  isInbox: boolean,
  showCommunityOwnerUpsell: boolean,
};
class ComposerPlaceholder extends React.Component<Props> {
  render() {
    const { isOpen, showCommunityOwnerUpsell, isInbox, dispatch } = this.props;

    return (
      <Container
        isOpen={isOpen}
        isInbox={isInbox}
        data-cy="thread-composer-placeholder"
      >
        <Composer
          isOpen={isOpen}
          onClick={() => dispatch(openComposer())}
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
export default connect()(ComposerPlaceholder);
