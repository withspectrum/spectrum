// @flow
import * as React from 'react';
import type { MessageInfoType } from 'shared/graphql/fragments/message/messageInfo.js';
import DraftEditor from '../draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createCodeEditorPlugin from 'draft-js-code-editor-plugin';
import createMarkdownPlugin from 'draft-js-markdown-plugin';
import Prism from 'prismjs';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-scala';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-perl';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-swift';
import createPrismPlugin from 'draft-js-prism-plugin';
import { customStyleMap } from 'src/components/rich-text-editor/style';
import { EditorInput, EditActions } from './style';
import { toPlainText, toState, toJSON } from 'shared/draft-utils';
import { TextButton, Button } from 'src/components/buttons';
import type { Dispatch } from 'redux';
import { addToastWithTimeout } from 'src/actions/toasts';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import editMessageMutation from 'shared/graphql/mutations/message/editMessage';
import { KeyBindingUtil } from 'draft-js';

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

class Editing extends React.Component<Props, State> {
  editor: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      plugins: [
        createPrismPlugin({
          prism: Prism,
        }),
        createMarkdownPlugin({
          features: {
            inline: ['BOLD', 'ITALIC', 'CODE'],
            block: ['CODE', 'blockquote'],
          },
          renderLanguageSelect: () => null,
        }),
        createCodeEditorPlugin(),
        createLinkifyPlugin({
          target: '_blank',
        }),
      ],
      body: toState(JSON.parse(props.message.content.body)),
      isSavingEdit: false,
    };
  }

  componentDidMount() {
    this.triggerFocus();
  }

  setRef = (editor: any) => {
    const { editorRef } = this.props;
    this.editor = editor;
    if (editorRef && typeof editorRef === 'function') editorRef(editor);
  };

  onChange = (state: any) => {
    this.setState({
      body: state,
    });
  };

  handleReturn = (e: any) => {
    // Always submit on CMD+Enter
    if (KeyBindingUtil.hasCommandModifier(e)) {
      return this.save();
    }

    return 'not-handled';
  };

  triggerFocus = () => {
    // NOTE(@mxstbr): This needs to be delayed for a tick, otherwise the
    // decorators that are passed to the editor are removed from the editor
    // state
    setTimeout(() => {
      this.editor && this.editor.focus && this.editor.focus();
    }, 0);
  };

  save = () => {
    const { message, editMessage, cancelEdit, dispatch } = this.props;
    const { body } = this.state;
    const messageId = message.id;

    const jsonBody = toJSON(body);

    // dont let the user edit the message by deleting all the content
    if (!toPlainText(body) || toPlainText(body).length === 0) {
      return cancelEdit();
    }

    const content = {
      body: JSON.stringify(jsonBody),
    };

    const input = {
      id: messageId,
      content,
    };

    editMessage(input)
      .then(({ data: { editMessage } }) => {
        this.setState({
          isSavingEdit: false,
        });

        if (editMessage && editMessage !== null) {
          cancelEdit();
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
        this.setState({
          isSavingEdit: false,
        });
        dispatch(addToastWithTimeout('error', err.message));
      });
  };

  render() {
    const { editorRef, cancelEdit, ...rest } = this.props;
    const { plugins, body } = this.state;

    return (
      <React.Fragment>
        <EditorInput>
          <DraftEditor
            editorState={body}
            onChange={this.onChange}
            plugins={plugins}
            editorRef={this.setRef}
            readOnly={false}
            placeholder={'Your message'}
            spellCheck={true}
            autoCapitalize="sentences"
            autoComplete="on"
            autoCorrect="on"
            stripPastedStyles={true}
            customStyleMap={customStyleMap}
            handleReturn={this.handleReturn}
            {...rest}
          />
        </EditorInput>
        <EditActions>
          <TextButton onClick={cancelEdit}>Cancel</TextButton>
          <Button onClick={this.save}>Save</Button>
        </EditActions>
      </React.Fragment>
    );
  }
}

export default compose(
  connect(),
  editMessageMutation
)(Editing);
