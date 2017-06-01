// @flow
import React, { Component } from 'react';
//$FlowFixMe
import { Editor as SlateEditor, Raw, Plain } from 'slate';
//$FlowFixMe
import type { SlatePlugin } from 'slate-mentions/src/types';
//$FlowFixMe
import MarkdownPlugin from 'slate-markdown';
import { CustomPlaceholder, Wrapper } from './style';

const ENTER = 13;

const initialState = Plain.deserialize('');

type EditorProps = {
  markdown?: boolean,
  state?: Object,
  onChange?: Function,
  onEnter?: Function,
  placeholder?: string,
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

  onKeyDown = (e: Object) => {
    if (e.which === ENTER) {
      this.props.onEnter && this.props.onEnter(e);
    }
  };

  render() {
    const {
      state = this.state.state,
      onChange = this.onChange,
      onEnter,
      placeholder,
      ...rest
    } = this.props;

    {
      /* The custom placeholder stuff is a workaround for ianstormtaylor/slate#860 */
    }
    const isEmpty = toPlainText(state) === '';

    return (
      <Wrapper>
        <SlateEditor
          state={state}
          onChange={onChange}
          onKeyDown={onEnter && this.onKeyDown}
          plugins={this.state.plugins}
          {...rest}
        />
        {isEmpty && <CustomPlaceholder>{placeholder}</CustomPlaceholder>}
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
