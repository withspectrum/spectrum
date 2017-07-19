import React from 'react';
import styled from 'styled-components';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import DraftEditor, { composeDecorators } from 'draft-js-plugins-editor';
import createImagePlugin from 'draft-js-image-plugin';
import draftToMarkdown from 'draftjs-to-markdown';
import createFocusPlugin from 'draft-js-focus-plugin';
import createBlockDndPlugin from 'draft-js-drag-n-drop-plugin';
import createMarkdownShortcutsPlugin from 'draft-js-markdown-shortcuts-plugin';

import MediaInput from '../mediaInput';
import { ThreadDescription } from '../threadComposer/style';

const Wrapper = styled.div`
  .DraftEditor-root {
    padding: 1em;
    border: 1px solid black;
    margin: 1em 0;

    ${ThreadDescription};
  }
`;

const toMarkdown = editorState =>
  draftToMarkdown(convertToRaw(editorState.getCurrentContent()));

class Editor extends React.Component {
  constructor(props) {
    super(props);

    const focusPlugin = createFocusPlugin();
    const dndPlugin = createBlockDndPlugin();

    const decorator = composeDecorators(
      focusPlugin.decorator,
      dndPlugin.decorator
    );

    const imagePlugin = createImagePlugin({ decorator });

    this.state = {
      plugins: [
        imagePlugin,
        createMarkdownShortcutsPlugin(),
        dndPlugin,
        focusPlugin,
      ],
      addImage: imagePlugin.addImage,
      editorState: EditorState.createEmpty(),
    };
  }

  onChange = editorState => {
    this.setState({
      editorState,
    });
  };

  addImage = e => {
    const files = e.target.files;
    let { editorState, addImage } = this.state;
    // Add images to editorState
    // eslint-disable-next-line
    for (var i = 0, file; (file = files[i]); i++) {
      editorState = addImage(editorState, window.URL.createObjectURL(file));
    }

    this.onChange(editorState);
  };

  render() {
    return (
      <Wrapper>
        <DraftEditor
          editorState={this.state.editorState}
          onChange={this.onChange}
          plugins={this.state.plugins}
        />
        <MediaInput onChange={this.addImage} multiple>
          Add
        </MediaInput>
      </Wrapper>
    );
  }
}

export { toMarkdown, convertFromRaw };

export default Editor;
