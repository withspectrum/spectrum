// @flow
import React from 'react';
import DraftEditor, { composeDecorators } from 'draft-js-plugins-editor';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
import createCodeEditorPlugin from 'draft-js-code-editor-plugin';
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

import { InputWrapper } from './style';

type Props = {
  editorState: Object,
  onChange: Object => void,
  placeholder: string,
  className?: string,
  focus?: boolean,
  code?: boolean,
  readOnly?: boolean,
  editorRef?: any => void,
};

type State = {
  plugins: Array<mixed>,
};

class Input extends React.Component<Props, State> {
  editor: any;

  constructor(props: Props) {
    super(props);

    this.state = {
      plugins: [],
    };
  }

  componentWillMount() {
    this.setPlugins();
  }

  componentWillReceiveProps(next: Props) {
    const curr = this.props;
    if (next.code !== curr.code) {
      this.setPlugins(next);
    }
  }

  setPlugins = (next?: Props) => {
    const props = next || this.props;
    const plugins = [];

    if (props.code) {
      plugins.push(
        createPrismPlugin({
          prism: Prism,
        }),
        createCodeEditorPlugin()
      );
    } else {
      plugins.push(
        createLinkifyPlugin({
          target: '_blank',
        })
      );
    }

    this.setState({
      plugins: plugins,
    });
  };

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
      code,
      ...rest
    } = this.props;
    const { plugins } = this.state;

    return (
      <InputWrapper code={code} focus={focus}>
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
          {...rest}
        />
      </InputWrapper>
    );
  }
}

export default Input;
