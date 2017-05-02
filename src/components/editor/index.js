import React, { Component } from 'react';
import { Editor as SlateEditor, Raw } from 'slate';

import MentionsPlugin from './plugins/mentions';

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

class Editor extends Component {
  state = {
    state: initialState,
    plugins: [MentionsPlugin()],
  };

  onChange = state => {
    this.setState({ state });
  };

  render() {
    const state = this.props.state || this.state.state;
    const onChange = this.props.onChange || this.onChange;

    return (
      <SlateEditor
        state={state}
        onChange={onChange}
        readOnly={false}
        plugins={this.state.plugins}
        schema={this.state.schema}
        onKeyDown={this.onKeyDown}
      />
    );
  }
}

export default Editor;
