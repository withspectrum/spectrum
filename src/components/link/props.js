// @flow
// This file exports an array of all props that are valid on an `a` (anchor)
// element. We need to do that so that we don’t spread invalid props on React
// Router’s `<Link>` component, which would trigger an error.

const BASE_PROPS = [
  'id',
  'className',
  'tabIndex',
  'lang',
  'aria-hidden',
  'children',
];
const FOCUS_EVENTS = ['onFocus', 'onBlur'];
const MOUSE_EVENTS = [
  'onClick',
  'onContextMenu',
  'onDoubleClick',
  'onDrag',
  'onDragEnd',
  'onDragEnter',
  'onDragExit',
  'onDragLeave',
  'onDragOver',
  'onDragStart',
  'onDrop',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
];

const LINK_PROPS = [
  'href',
  'hrefLang',
  'rel',
  'target',
  'autoFocus',
  'aria-label',
  'aria-current',
  'to',
  'download',
  'title',
];

export default [...BASE_PROPS, ...LINK_PROPS, ...FOCUS_EVENTS, ...MOUSE_EVENTS];
