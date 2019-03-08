// @flow
import * as React from 'react';
import type { MessageInfoType } from 'shared/graphql/fragments/message/messageInfo.js';
import { Input } from '../chatInput/style';
import { EditorInput, EditActions } from './style';
import { TextButton, Button } from 'src/components/buttons';
import type { Dispatch } from 'redux';
import { addToastWithTimeout } from 'src/actions/toasts';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import editMessageMutation from 'shared/graphql/mutations/message/editMessage';

type Props = {
  message: MessageInfoType,
  cancelEdit: Function,
  editorRef?: any => void,
  editMessage: Function,
  dispatch: Dispatch<Object>,
};

type State = {
  plugins: Array<mixed>,
  body: string,
  isSavingEdit: boolean,
};

const EditingChatInput = (props: Props) => {
  const initialState =
    props.message.messageType === 'text' ? props.message.content.body : null;
  // $FlowIssue
  const [text, setText] = React.useState(initialState);
  // $FlowIssue
  const [saving, setSaving] = React.useState(false);

  // $FlowIssue
  React.useEffect(
    () => {
      if (props.message.messageType === 'text') return;

      setText(null);
      fetch('https://convert.spectrum.chat/to', {
        method: 'POST',
        body: props.message.content.body,
      })
        .then(res => res.text())
        .then(md => {
          setText(md);
        });
    },
    [props.message.id]
  );

  const onChange = e => {
    const text = e.target.value;
    setText(text);
  };

  const handleKeyPress = e => {
    // Submit on Enter unless Shift is pressed
    if (e.key === 'Enter') {
      if (e.metaKey) {
        e.preventDefault();
        return submit();
      }
    }
  };

  const submit = () => {
    const { message, editMessage, dispatch } = props;
    const messageId = message.id;

    if (!text || text.length === 0) return props.cancelEdit();

    const content = {
      body: text.replace(/@\[([a-z0-9_-]+)\]/g, '@$1'),
    };

    const input = {
      id: messageId,
      messageType: 'text',
      content,
    };

    setSaving(true);

    editMessage(input)
      .then(({ data: { editMessage } }) => {
        setSaving(false);

        if (editMessage && editMessage !== null) {
          props.cancelEdit();
          return dispatch(addToastWithTimeout('success', 'Saved!'));
        } else {
          return dispatch(
            addToastWithTimeout(
              'error',
              "We weren't able to save these changes. Try again?"
            )
          );
        }
      })
      .catch(err => {
        setSaving(false);
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  return (
    <React.Fragment>
      {text !== null ? (
        <EditorInput data-cy="edit-message-input">
          <Input
            dataCy="editing-chat-input"
            placeholder="Your message here..."
            value={text}
            onChange={onChange}
            onKeyDown={handleKeyPress}
            inputRef={props.editorRef}
            autoFocus
          />
        </EditorInput>
      ) : (
        <p>Loading...</p>
      )}
      <EditActions>
        {!saving && (
          <TextButton dataCy="edit-message-cancel" onClick={props.cancelEdit}>
            Cancel
          </TextButton>
        )}
        <Button loading={saving} dataCy="edit-message-save" onClick={submit}>
          Save
        </Button>
      </EditActions>
    </React.Fragment>
  );
};

export default compose(
  connect(),
  editMessageMutation
)(EditingChatInput);
