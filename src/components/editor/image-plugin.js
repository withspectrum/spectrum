// @flow
import React from 'react';
import { Block } from 'slate';
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

const onDropOrPasteFiles = (e, data, state, editor) => {
  for (const file of data.files) {
    const reader = new FileReader();
    const [type] = file.type.split('/');
    if (type != 'image') continue;

    reader.addEventListener('load', () => {
      state = editor.getState();
      state = insertImage(state, reader.result);
      editor.onChange(state);
    });

    reader.readAsDataURL(file);
  }
};

const onPasteText = (e, data, state) => {
  // TODO: Figure out what to do with this logic
  // if (!isUrl(data.text)) return
  // if (!isImage(data.text)) return
  // return this.insertImage(state, data.text)
};

const insertImage = (state, src) => {
  return state
    .transform()
    .insertBlock({
      type: 'image',
      isVoid: true,
      data: { src },
    })
    .apply();
};

const onClickImage = e => {
  e.preventDefault();
  // TODO: Figure out what to do here
  // const src = window.prompt('Enter the URL of the image:')
  const src = undefined;
  if (!src) return;
  let { state } = this.state;
  state = insertImage(state, src);
  // this.onChange(state)
};

const ImagePlugin = {
  schema: {
    nodes: {
      image: props => {
        const { node, state } = props;
        const active = state.isFocused && state.selection.hasEdgeIn(node);
        const src = node.data.get('src');
        const className = active ? 'active' : null;
        return <img src={src} className={className} {...props.attributes} />;
      },
      paragraph: props => {
        return <p {...props.attributes}>{props.children}</p>;
      },
    },
    rules: [
      // Rule to insert a paragraph block if the document is empty.
      {
        match: node => {
          return node.kind == 'document';
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
          return node.kind == 'document';
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
      case 'text':
        return onPasteText(e, data, state);
    }
  },
};

export default ImagePlugin;
