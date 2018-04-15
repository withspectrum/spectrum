// @flow
import React from 'react';
import DraftEditor from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createCodeEditorPlugin from 'draft-js-code-editor-plugin';
import createMarkdownPlugin from 'draft-js-markdown-plugin';
import styled from 'styled-components';
import Prism from 'prismjs';
import debounce from 'debounce';
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
import { toPlainText, fromPlainText, isAndroid } from 'shared/draft-utils';
import { customStyleMap } from 'src/components/draftjs-editor/style';
import type { DraftEditorState } from 'draft-js/lib/EditorState';

import { InputWrapper, MediaPreview } from './style';

type Props = {
  editorState: DraftEditorState,
  onChange: DraftEditorState => void,
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
  value: ?string,
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

    this.debouncedPropsOnChange = debounce(this.debouncedPropsOnChange, 100);
    this.state = {
      value: isAndroid() ? toPlainText(props.editorState) : null,
      plugins: [
        createPrismPlugin({
          prism: Prism,
        }),
        createMarkdownPlugin({
          features: {
            inline: ['BOLD', 'ITALIC', 'CODE'],
            block: ['CODE', 'ordered-list-item', 'unordered-list-item'],
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

  componentWillReceiveProps(next: Props) {
    const curr = this.props;
    if (next.editorState !== curr.editorState) {
      this.setState({
        value: toPlainText(next.editorState),
      });
    }
  }

  setRef = (editor: any) => {
    const { editorRef } = this.props;
    this.editor = editor;
    if (editorRef && typeof editorRef === 'function') editorRef(editor);
  };

  // When we're on Android, we only send onChange to the parent every couple ms
  // because it's very expensive to convert plain text to DraftJS content state
  debouncedPropsOnChange = () => {
    this.props.onChange(fromPlainText(this.state.value || ''));
  };

  plainTextOnChange = (e: SyntheticInputEvent<>) => {
    const { value } = e.target;
    this.setState({
      value,
    });

    this.debouncedPropsOnChange();
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
    const { plugins, value } = this.state;

    return (
      <InputWrapper focus={focus} networkDisabled={networkDisabled}>
        {mediaPreview && (
          <MediaPreview>
            <img src={mediaPreview} alt="" />
            <button onClick={onRemoveMedia} />
          </MediaPreview>
        )}
        {isAndroid() ? (
          // NOTE(@mxstbr): This mimics the Draft Editor's DOM structure and classes
          // so that the styling looks correct
          <div className="DraftEditor-root">
            <div className="DraftEditor-editorContainer">
              <input
                type="text"
                value={value}
                onChange={this.plainTextOnChange}
                placeholder={!readOnly && placeholder}
                spellCheck={true}
                autoCapitalize="sentences"
                autoComplete="on"
                autoCorrect="on"
                stripPastedStyles={true}
                ref={this.setRef}
                className={`DraftEditor-content ${this.props.className || ''}`}
                // NOTE(@mxstbr): For some reason this is necessary
                // to align the styling
                style={{ width: '100%', fontSize: '14px' }}
              />
            </div>
          </div>
        ) : (
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
        )}
      </InputWrapper>
    );
  }
}

export default Input;
