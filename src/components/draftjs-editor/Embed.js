// Taken from https://github.com/vacenz/last-draft-js-plugins/blob/1a913e15ef5225b8a4e2253b282af3a5c382e7b0/draft-js-embed-plugin/src/embed/index.js
// slightly adapted to work with arbitrary data passed from the entity
import { Entity, EditorState, AtomicBlockUtils } from 'draft-js';
import React, { Component } from 'react';
import { AspectRatio, EmbedComponent } from './style';

// Taken from https://github.com/vacenz/last-draft-js-plugins/blob/master/draft-js-embed-plugin/src/modifiers/addEmbed.js
// adapted to pass additional attrs onto the iframe
export const addEmbed = (editorState, attrs) => {
  const urlType = 'embed';
  const entityKey = Entity.create(urlType, 'IMMUTABLE', {
    src: attrs.url,
    aspectRatio: attrs.aspectRatio,
  });
  const newEditorState = AtomicBlockUtils.insertAtomicBlock(
    editorState,
    entityKey,
    ' '
  );
  return EditorState.forceSelection(
    newEditorState,
    editorState.getCurrentContent().getSelectionAfter()
  );
};

export default class Embed extends Component {
  render() {
    const { block, theme = {}, ...otherProps } = this.props;
    // leveraging destructuring to omit certain properties from props
    const {
      blockProps, // eslint-disable-line no-unused-vars
      customStyleMap, // eslint-disable-line no-unused-vars
      customStyleFn, // eslint-disable-line no-unused-vars
      decorator, // eslint-disable-line no-unused-vars
      forceSelection, // eslint-disable-line no-unused-vars
      offsetKey, // eslint-disable-line no-unused-vars
      selection, // eslint-disable-line no-unused-vars
      tree, // eslint-disable-line no-unused-vars
      contentState,
      ...elementProps
    } = otherProps;
    const data = Entity.get(block.getEntityAt(0)).getData();
    const { aspectRatio, src } = data;
    return (
      <AspectRatio ratio={aspectRatio}>
        <EmbedComponent
          title={`iframe-${src}`}
          {...elementProps}
          {...data}
          src={src}
          className={theme.embedStyles.embed}
        />
      </AspectRatio>
    );
  }
}
