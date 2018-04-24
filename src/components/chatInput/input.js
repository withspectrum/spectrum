// @flow
import React from 'react';
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
import type { DraftEditorState } from 'draft-js/lib/EditorState';

import { InputWrapper } from './style';

type Props = {
  editorState: DraftEditorState,
  onChange: DraftEditorState => void,
  placeholder: string,
  className?: string,
  focus?: boolean,
  readOnly?: boolean,
  editorRef?: any => void,
  networkDisabled: boolean,
  children?: React$Node,
};

type State = {
  plugins: Array<mixed>,
};

/*
 * NOTE(@mxstbr): DraftJS has huge troubles on Android, it's basically unusable
 * We work around this by replacing the DraftJS editor with a plain text Input
 * on Android, and then converting the plain text to DraftJS content State
 * debounced every couple ms
 */
class Input extends React.Component<Props, State> {
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
            block: ['CODE'],
          },
          renderLanguageSelect: () => null,
        }),
        createCodeEditorPlugin(),
        createLinkifyPlugin({
          target: '_blank',
        }),
      ],
    };
  }

  setRef = (editor: any) => {
    const { editorRef } = this.props;
    this.editor = editor;
    if (editorRef && typeof editorRef === 'function') editorRef(editor);
  };

  render() {
    const {
      editorState,
      onChange,
      focus,
      placeholder,
      readOnly,
      editorRef,
      networkDisabled,
      children,
      ...rest
    } = this.props;
    const { plugins } = this.state;

    return (
      <InputWrapper focus={focus} networkDisabled={networkDisabled}>
        {children}
        <DraftEditor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
          editorRef={this.setRef}
          readOnly={readOnly}
          placeholder={!readOnly && placeholder}
          spellCheck={true}
          autoCapitalize="sentences"
          autoComplete="on"
          autoCorrect="on"
          stripPastedStyles={true}
          customStyleMap={customStyleMap}
          {...rest}
        />
      </InputWrapper>
    );
  }
}

export default Input;
