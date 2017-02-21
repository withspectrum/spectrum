/*------------------------------------------------------------\*
*

showModal
Takes a name and shows that modal. The name gets parsed in ModalRoot.js in order to determine which component to render

*
\*------------------------------------------------------------*/
export const showModal = (name, props) => ({
  type: 'SHOW_MODAL',
  modalType: name,
  modalProps: props || {}
});

export const hideModal = () => ({
  type: 'HIDE_MODAL',
});
