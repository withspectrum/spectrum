// @flow
import React, { Component } from 'react';
//$FlowFixMe
import { Editor as SlateEditor, Raw, Plain } from 'slate';
//$FlowFixMe
import type { SlatePlugin } from 'slate-mentions/src/types';
//$FlowFixMe
import MarkdownPlugin from 'slate-markdown';
import { Wrapper } from './style';
import SingleLinePlugin from './single-line-plugin';
import ImagePlugin from './image-plugin';

const ENTER = 13;

const initialState = Plain.deserialize('');

type EditorProps = {
  markdown?: boolean,
  state?: Object,
  onChange?: Function,
  onEnter?: Function,
  placeholder?: string,
  singleLine?: boolean,
  className?: string,
  style?: Object,
  images?: boolean,
};

class Editor extends Component {
  props: EditorProps;
  editor: any;

  state: {
    state: Object,
    plugins: Array<SlatePlugin | false>,
  };

  constructor(props: EditorProps) {
    super(props);
    this.state = {
      state: initialState,
      plugins: [
        props.markdown !== false && MarkdownPlugin(),
        props.images !== false && ImagePlugin,
        props.singleLine === true && SingleLinePlugin,
      ],
    };
  }

  onChange = (state: Object) => {
    this.setState({ state });
  };

  onKeyDown = (e: Object) => {
    if (e.which === ENTER) {
      this.props.onEnter && this.props.onEnter(e);
    }
  };

  focus = () => {
    this.editor.focus();
  };

  render() {
    const {
      state = this.state.state,
      onChange = this.onChange,
      onEnter,
      className,
      style,
      ...rest
    } = this.props;

    return (
      <Wrapper className={className} style={style} onClick={this.focus}>
        <SlateEditor
          state={state}
          onChange={onChange}
          onKeyDown={onEnter && this.onKeyDown}
          plugins={this.state.plugins}
          ref={editor => {
            this.editor = editor;
            if (this.props.editorRef) this.props.editorRef(editor);
          }}
          {...rest}
        />
      </Wrapper>
    );
  }
}

const toJSON = (state: Object) => Raw.serialize(state, { terse: true });
const toState = (json: Object) => Raw.deserialize(json, { terse: true });

const toPlainText = (state: Object) => Plain.serialize(state);
const fromPlainText = (string: string) => Plain.deserialize(string);

export { toJSON, toState, toPlainText, fromPlainText };

export default Editor;
