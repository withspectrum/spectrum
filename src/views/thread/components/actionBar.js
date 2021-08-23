// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { PrimaryOutlineButton, TextButton } from 'src/components/button';
import type { GetThreadType } from 'shared/graphql/queries/thread/getThread';
import type { Dispatch } from 'redux';
import {
  ActionBarContainer,
  FixedBottomActionBarContainer,
  EditDone,
} from '../style';
import ActionsDropdown from './actionsDropdown';

type Props = {
  thread: GetThreadType,
  currentUser: Object,
  isEditing: boolean,
  dispatch: Dispatch<Object>,
  toggleEdit: Function,
  saveEdit: Function,
  pinThread: Function,
  threadLock: Function,
  isSavingEdit: boolean,
  title: string,
  isLockingThread: boolean,
  isPinningThread: boolean,
  uploadFiles: Function,
};

class ActionBar extends React.Component<Props> {
  uploadFiles = evt => {
    this.props.uploadFiles(evt.target.files);
  };

  render() {
    const { thread, isEditing, isSavingEdit, title } = this.props;

    if (isEditing) {
      return (
        <FixedBottomActionBarContainer>
          <div style={{ display: 'flex' }}>
            <EditDone data-cy="cancel-thread-edit-button">
              <TextButton onClick={this.props.toggleEdit}>Cancel</TextButton>
            </EditDone>
            <EditDone>
              <PrimaryOutlineButton
                loading={isSavingEdit}
                disabled={title.trim().length === 0 || isSavingEdit}
                onClick={this.props.saveEdit}
                data-cy="save-thread-edit-button"
              >
                {isSavingEdit ? 'Saving...' : 'Save'}
              </PrimaryOutlineButton>
            </EditDone>
          </div>
        </FixedBottomActionBarContainer>
      );
    } else {
      return (
        <ActionBarContainer>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <ActionsDropdown
              thread={thread}
              toggleEdit={this.props.toggleEdit}
              lockThread={this.props.threadLock}
              isLockingThread={this.props.isLockingThread}
              isPinningThread={this.props.isPinningThread}
            />
          </div>
        </ActionBarContainer>
      );
    }
  }
}

export default compose(connect())(ActionBar);
