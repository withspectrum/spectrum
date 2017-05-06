// @flow
import React, { Component } from 'react';
import { Editor as SlateEditor, Raw } from 'slate';

import type { SlatePlugin } from './plugins/mentions/types';
import MentionsPlugin from './plugins/mentions';
import MarkdownPlugin from './plugins/markdown';

import Suggestions from './components/MentionSuggestions';

const initialState = Raw.deserialize(
  {
    nodes: [
      {
        kind: 'block',
        type: 'paragraph',
        nodes: [
          {
            kind: 'text',
            text: '',
          },
        ],
      },
    ],
  },
  { terse: true, normalize: false }
);

type EditorProps = {
  mentions?: boolean,
  markdown?: boolean,
  state?: Object,
  onChange?: Function,
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
      plugins: [
        props.mentions !== false &&
          MentionsPlugin({
            Mention: props => (
              <span
                {...props.attributes}
                style={{ background: 'red', color: 'white' }}
              >
                {props.children}
              </span>
            ),
            Suggestions,
          }),
        props.markdown !== false && MarkdownPlugin(),
      ],
    };
  }

  onChange = (state: Object) => {
    this.setState({ state });
  };

  render() {
    const state = this.props.state || this.state.state;
    const onChange = this.props.onChange || this.onChange;

    return (
      <SlateEditor
        state={state}
        onChange={onChange}
        plugins={this.state.plugins}
      />
    );
  }
}

export default Editor;
