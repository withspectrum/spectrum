// @flow
// This file was copy-and-pasted from the draft-js-side-toolbar-plugin and adapted
// for our codebase.
import React from 'react';
import { findDOMNode } from 'react-dom';
// $FlowIssue
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';

type EditorState = Object; // Draft.js editor state
type EditorRef = any; // A reference to the editor DOM node

type Props = {
  editorState: EditorState,
  children: Function,
  editorRef: EditorRef,
};

type ToolbarPosition = {
  top?: number,
  left?: number,
};

type State = {
  position: ?ToolbarPosition,
};

export default class Toolbar extends React.Component<Props, State> {
  state = {
    position: {},
  };

  componentDidMount() {
    this.setPosition(this.props.editorState, this.props.editorRef);
  }

  componentDidUpdate() {
    this.setPosition(this.props.editorState, this.props.editorRef);
  }

  setPosition = (editorState: EditorState, editorRef: EditorRef) => {
    if (!editorRef) return;
    const selection = editorState.getSelection();
    if (!selection.getHasFocus()) return;

    const currentContent = editorState.getCurrentContent();
    const currentBlock = currentContent.getBlockForKey(selection.getStartKey());
    if (!currentBlock) return;
    const offsetKey = DraftOffsetKey.encode(currentBlock.getKey(), 0, 0);
    if (!offsetKey) return;
    // NOTE(@juliankrispel): Need to wait on tick to make sure the DOM node has been create by Draft.js
    setTimeout(() => {
      const node = document.querySelectorAll(
        `[data-offset-key="${offsetKey}"]`
      )[0];
      if (!node) return;
      const top = node.getBoundingClientRect().top;
      const scrollY =
        window.scrollY == null ? window.pageYOffset : window.scrollY;
      const editor = findDOMNode(editorRef);
      if (!editor) return;
      this.setState({
        position: {
          top: top + scrollY,
          left: editor.getBoundingClientRect().left - 80,
        },
      });
    }, 0);
  };

  render() {
    const { position } = this.state;
    return this.props.children({ style: position });
  }
}
