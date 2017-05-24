// @flow
import React, { Component } from 'react';
import { Editor as SlateEditor, Raw, Plain } from 'slate';
import type { SlatePlugin } from 'slate-mentions/src/types';
import MarkdownPlugin from 'slate-markdown';

const ENTER = 13;

const initialState = Plain.deserialize('');

type EditorProps = {
  markdown?: boolean,
  state?: Object,
  onChange?: Function,
  onEnter?: Function,
};

class Editor extends Component {
  props: EditorProps;

  state: {
    state: Object,
    plugins: Array<SlatePlugin | false>,
  };

  constructor(props: EditorProps) {
    super(props);
    this.state = {
      state: initialState,
      plugins: [props.markdown !== false && MarkdownPlugin()],
    };
  }

  onChange = (state: Object) => {
    this.setState({ state });
  };

  onKeyDown = e => {
    if (e.which === ENTER) {
      this.props.onEnter && this.props.onEnter(e);
    }
  };

  render() {
    const {
      state = this.state.state,
      onChange = this.onChange,
      onEnter,
      // Don't pass these two down to the SlateEditor
      markdown,
      ...rest
    } = this.props;

    return (
      <SlateEditor
        state={state}
        onChange={onChange}
        onKeyDown={onEnter && this.onKeyDown}
        plugins={this.state.plugins}
        {...rest}
      />
    );
  }
}

const toJSON = (state: Object) => Raw.serialize(state, { terse: true });
const toState = (json: Object) => Raw.deserialize(json, { terse: true });

const toPlainText = (state: Object) => Plain.serialize(state);
const fromPlainText = (string: string) => Plain.deserialize(string);

export { toJSON, toState, toPlainText, fromPlainText };

export default Editor;
