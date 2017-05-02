/**
 * Stolen from https://gist.github.com/ianstormtaylor/7924e6abc71c1efa40411a4553afe4dc
 *
 * Slightly adapted
 */
import React from 'react';
import Portal from 'react-portal';
import getOffsets from 'positions';
import { findDOMNode } from 'slate';

/**
 * No-op.
 *
 * @type {Function}
 */

function noop() {}

/**
 * A component that opens a portal relative to a Slate node.
 *
 * @type {Component}
 */

class SlateNodePortal extends React.Component {
  /**
   * Property types.
   *
   * @type {Object}
   */

  static propTypes = {
    children: React.PropTypes.any.isRequired,
    menuAnchor: React.PropTypes.string,
    node: React.PropTypes.object.isRequired,
    nodeAnchor: React.PropTypes.string,
    onClose: React.PropTypes.func,
    onOpen: React.PropTypes.func,
    onUpdate: React.PropTypes.func,
  };

  /**
   * Default properties.
   *
   * @type {Object}
   */

  static defaultProps = {
    menuAnchor: 'bottom middle',
    nodeAnchor: 'bottom middle',
    onClose: noop,
    onOpen: noop,
    onUpdate: noop,
  };

  /**
   * On portal open, store a reference to it and update the menu's position.
   *
   * @param {Element} portal
   */

  onOpen = portal => {
    this.portal = portal;
    this.update();
    this.props.onOpen(portal);
  };

  /**
   * On portal update, update the menu's position.
   */

  onUpdate = () => {
    this.update();
    this.props.onUpdate();
  };

  /**
   * On portal close, remove the portal reference.
   */

  onClose = () => {
    this.portal = null;
    this.props.onClose();
  };

  /**
   * Update the menu's position, relative to the current node.
   */

  update = () => {
    if (!this.portal) return;
    const { node, nodeAnchor, menuAnchor } = this.props;

    const menuEl = this.portal.firstChild;
    menuEl.style.position = 'absolute';

    const nodeEl = findDOMNode(node);
    const offset = getOffsets(menuEl, menuAnchor, nodeEl, nodeAnchor);
    menuEl.style.top = `${offset.top + 16}px`;
    menuEl.style.left = `${offset.left}px`;
  };

  /**
   * Render.
   *
   * @return {Element}
   */

  render = () => {
    const {
      children,
      menuAnchor,
      node,
      nodeAnchor,
      onClose,
      onOpen,
      onUpdate,
      ...props
    } = this.props;

    return (
      <Portal
        {...props}
        isOpened
        onOpen={this.onOpen}
        onUpdate={this.onUpdate}
        onClose={this.onClose}
      >
        {children}
      </Portal>
    );
  };
}

/**
 * Export.
 *
 * @type {Component}
 */

export default SlateNodePortal;
