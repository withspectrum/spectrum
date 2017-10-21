// @flow
import React from 'react';
import DraftEditor, { composeDecorators } from 'draft-js-plugins-editor';
import createSingleLinePlugin from 'draft-js-single-line-plugin';
import createLinkifyPlugin from 'draft-js-linkify-plugin';
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
  singleLine?: boolean,
  code?: boolean,
  readOnly?: boolean,
  editorRef?: any => void,
};

type State = {
  plugins: Array<mixed>,
  blockRenderMap?: Object,
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
    if (next.code !== curr.code || next.singleLine !== curr.singleLine) {
      this.setPlugins(next);
    }
  }

  setPlugins = (next?: Props) => {
    const props = next || this.props;
    const plugins = [];
    const other = {};

    if (props.code) {
      plugins.push(
        createPrismPlugin({
          prism: Prism,
        })
      );
    } else {
      plugins.push(
        createLinkifyPlugin({
          target: '_blank',
        })
      );
    }

    if (props.singleLine) {
      const singleLine = createSingleLinePlugin();
      plugins.push(singleLine);
      other.blockRenderMap = singleLine.blockRenderMap;
    }

    this.setState({
      ...other,
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
      singleLine,
      placeholder,
      readOnly,
      className,
      editorRef,
      ...rest
    } = this.props;
    const { plugins, blockRenderMap } = this.state;

    return (
      <InputWrapper focus={focus}>
        <DraftEditor
          editorState={editorState}
          onChange={onChange}
          plugins={plugins}
          blockRenderMap={blockRenderMap}
          ref={this.setRef}
          readOnly={readOnly}
          placeholder={!readOnly && placeholder}
          spellCheck="false"
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          {...rest}
        />
      </InputWrapper>
    );
  }
}

export default Input;
