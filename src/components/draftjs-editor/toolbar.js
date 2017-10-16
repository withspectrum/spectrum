// @flow
// This file was copy-and-pasted from the draft-js-side-toolbar-plugin and adapted
// for our codebase.
import React from 'react';
import { findDOMNode } from 'react-dom';
// $FlowIssue
import DraftOffsetKey from 'draft-js/lib/DraftOffsetKey';
import { SideToolbarWrapper } from './style';

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
      let editor;
      // NOTE(@mxstbr): For some reason this is called directly after you publish
      // a thread, but then the editor doesn't exist anymore so findDOMNode throws
      // an error "Cannot find unmounted DOM node".
      // See https://github.com/withspectrum/spectrum/issues/1636
      try {
        editor = findDOMNode(editorRef);
      } catch (err) {
        return;
      }
      if (!editor || typeof editor.getBoundingClientRect !== 'function') return;
      this.setState({
        position: {
          top: top + scrollY,
          left: editor.getBoundingClientRect().left - 48,
        },
      });
    }, 0);
  };

  render() {
    const { editorState } = this.props;
    const { position } = this.state;
    if (editorState) {
      const selection = editorState.getSelection();
      const content = editorState.getCurrentContent();
      // if (!selection.getHasFocus() && !content.hasText()) return null;
    }
    return (
      <SideToolbarWrapper style={position}>
        {this.props.children}
      </SideToolbarWrapper>
    );
  }
}
