// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import type { Dispatch } from 'redux';
import { ActionBarContainer } from '../style';
import ActionsDropdown from './actionsDropdown';

type Props = {
  thread: GetThreadType,
  currentUser: Object,
  dispatch: Dispatch<Object>,
  title: string,
};

class ActionBar extends React.Component<Props> {
  render() {
    const { thread } = this.props;

    return (
      <ActionBarContainer>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <ActionsDropdown thread={thread} />
        </div>
      </ActionBarContainer>
    );
  }
}

export default compose(connect())(ActionBar);
