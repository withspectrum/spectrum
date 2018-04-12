// @flow
import React from 'react';
import DraftEditor from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createCodeEditorPlugin from 'draft-js-code-editor-plugin';
import createMarkdownPlugin from 'draft-js-markdown-plugin';
import Prism from 'prismjs';
import { customStyleMap } from 'src/components/draftjs-editor/style';
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

import { InputWrapper, MediaPreview } from './style';

type Props = {
  editorState: Object,
  onChange: Object => void,
  placeholder: string,
  className?: string,
  focus?: boolean,
  readOnly?: boolean,
  editorRef?: any => void,
  networkDisabled: boolean,
  mediaPreview?: string,
  onRemoveMedia: Object => void,
};

type State = {
  plugins: Array<mixed>,
};

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
            block: ['CODE', 'ordered-list-item', 'unordered-list-item'],
          },
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
      mediaPreview,
      onRemoveMedia,
      ...rest
    } = this.props;
    const { plugins } = this.state;

    return (
      <InputWrapper focus={focus} networkDisabled={networkDisabled}>
        {mediaPreview && (
          <MediaPreview>
            <img src={mediaPreview} alt="" />
            <button onClick={onRemoveMedia} />
          </MediaPreview>
        )}
        <DraftEditor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
          ref={this.setRef}
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
