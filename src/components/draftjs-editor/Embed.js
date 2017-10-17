// Taken from https://github.com/vacenz/last-draft-js-plugins/blob/1a913e15ef5225b8a4e2253b282af3a5c382e7b0/draft-js-embed-plugin/src/embed/index.js
// slightly adapted to work with arbitrary data passed from the entity
import { Entity } from 'draft-js';
import React, { Component } from 'react';

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
      ...elementProps
    } = otherProps;
    const data = Entity.get(block.getEntityAt(0)).getData();
    return (
      <iframe
        title={data.src}
        {...elementProps}
        {...data}
        src={data.src}
        className={theme.embedStyles.embed}
      />
    );
  }
}
