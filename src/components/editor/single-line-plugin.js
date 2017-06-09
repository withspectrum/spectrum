// @flow
// Taken from https://github.com/ianstormtaylor/slate/issues/419
// TODO: Make separate package
const SingleLinePlugin = {
  schema: {
    rules: [
      {
        match: node => node.kind === 'document',
        validate: node => (node.nodes.size > 1 ? true : null),
        normalize: (transform, node, value) => {
          const toRemove = node.nodes.slice(1);
          toRemove.forEach(child => transform.removeNodeByKey(child.key));
        },
      },
    ],
  },
};

export default SingleLinePlugin;
