// @flow
import React from 'react';
import { Block } from 'slate';
import Image, { ImageContainer, ActiveOverlay } from './Image';

const DEFAULT_BLOCK = {
  type: 'paragraph',
  isVoid: false,
  data: {},
};

const onDropNode = (e, data, state) => {
  return state
    .transform()
    .deselect()
    .removeNodeByKey(data.node.key)
    .select(data.target)
    .insertBlock(data.node)
    .apply();
};

const insertImage = (state, src, file) => {
  return state
    .transform()
    .insertBlock({
      type: 'image',
      isVoid: true,
      data: { src, file },
    })
    .apply();
};

const onDropOrPasteFiles = (e, data, state, editor) => {
  data.files.forEach(file => {
    const reader = new FileReader();
    const [type] = file.type.split('/');
    if (type !== 'image') return;

    reader.addEventListener('load', () => {
      state = editor.getState();
      state = insertImage(state, reader.result, file);
      editor.onChange(state);
    });

    reader.readAsDataURL(file);
  });
};

const ImagePlugin = () => ({
  insertImage: insertImage,
  schema: {
    nodes: {
      image: props => {
        const { node, state } = props;
        const active = state.isFocused && state.selection.hasEdgeIn(node);
        const src = node.data.get('src');
        return (
          <ImageContainer active={active}>
            <ActiveOverlay active={active} />
            <Image src={src} active={active} {...props.attributes} />
          </ImageContainer>
        );
      },
      paragraph: props => {
        return <p {...props.attributes}>{props.children}</p>;
      },
    },
    rules: [
      // Rule to insert a paragraph block if the document is empty.
      {
        match: node => {
          return node.kind === 'document';
        },
        validate: document => {
          return document.nodes.size ? null : true;
        },
        normalize: (transform, document) => {
          const block = Block.create(DEFAULT_BLOCK);
          transform.insertNodeByKey(document.key, 0, block);
        },
      },
      // Rule to insert a paragraph below a void node (the image) if that node is
      // the last one in the document.
      {
        match: node => {
          return node.kind === 'document';
        },
        validate: document => {
          const lastNode = document.nodes.last();
          return lastNode && lastNode.isVoid ? true : null;
        },
        normalize: (transform, document) => {
          const block = Block.create(DEFAULT_BLOCK);
          transform.insertNodeByKey(document.key, document.nodes.size, block);
        },
      },
    ],
  },
  onDrop: (e, data, state, editor) => {
    switch (data.type) {
      case 'files':
        return onDropOrPasteFiles(e, data, state, editor);
      case 'node':
        return onDropNode(e, data, state);
    }
  },
  onPaste: (e, data, state, editor) => {
    switch (data.type) {
      case 'files':
        return onDropOrPasteFiles(e, data, state, editor);
    }
  },
});

export default ImagePlugin;
